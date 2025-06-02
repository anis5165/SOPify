let isRecording = false;
let port;
let captureInProgress = false;
let recordingInitialized = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
let reconnectTimer = null;

// Immediately try to connect when loaded
initializeConnection();

function initializeConnection() {
  // Clear any existing reconnect timer
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  console.log('Content script loaded - checking authentication');
  try {
    // First check authentication state
    chrome.runtime.sendMessage({ action: 'checkAuth' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Auth check error:', chrome.runtime.lastError);
        scheduleReconnect();
        return;
      }
      
      console.log('Auth check response:', response);
      if (response?.isAuthenticated && response?.token) {
        setupRecording();
      }
    });
  } catch (e) {
    console.error('Error during initialization:', e);
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  reconnectAttempts++;
  if (reconnectAttempts <= MAX_RECONNECT_ATTEMPTS) {
    console.log(`Scheduling reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
    reconnectTimer = setTimeout(() => {
      initializeConnection();
    }, 2000 * Math.pow(2, reconnectAttempts - 1)); // Exponential backoff
  }
}

function setupRecording() {
  if (recordingInitialized) {
    console.log('Recording already initialized');
    return;
  }
  
  recordingInitialized = true;
  reconnectAttempts = 0; // Reset reconnect attempts on successful setup
  console.log('Setting up recording functionality');
  
  // Connect to the background script
  try {
    port = chrome.runtime.connect({ name: 'content-script' });
    
    port.onDisconnect.addListener(() => {
      console.log('Disconnected from background script');
      recordingInitialized = false;
      if (isRecording) {
        stopRecording();
        isRecording = false;
      }
      
      // Try to reconnect if not too many attempts yet
      scheduleReconnect();
    });
    
    port.onMessage.addListener((message) => {
      console.log('Message from background:', message);
      if (message.action === 'recordingStateChanged') {
        handleRecordingStateChange(message.enabled);
      }
    });
  } catch (e) {
    console.error('Error connecting to background script:', e);
    scheduleReconnect();
  }
  
  // Listen for recording state changes via one-time messages
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);
    if (request.action === 'recordingStateChanged') {
      handleRecordingStateChange(request.enabled);
      sendResponse({ success: true });
    }
    return true;
  });

  // Notify background script that content script is ready
  chrome.runtime.sendMessage({ action: 'contentScriptReady' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error notifying content script ready:', chrome.runtime.lastError);
      return;
    }
    console.log('Content script ready notification response:', response);
  });
}

function handleRecordingStateChange(enabled) {
  isRecording = enabled;
  if (isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
}

function startRecording() {
  console.log('Starting recording...');
  // Add event listeners with throttling/debouncing
  document.addEventListener('click', handleClick, true);
  document.addEventListener('input', debounce(handleInput, 300), true);
  document.addEventListener('change', handleChange, true);
  document.addEventListener('scroll', debounce(handleScroll, 500), true);
  document.addEventListener('keyup', debounce(handleKeyup, 1000), true);
  document.addEventListener('select', debounce(handleSelect, 500), true);
}

function stopRecording() {
  console.log('Stopping recording...');
  // Remove event listeners
  document.removeEventListener('click', handleClick, true);
  document.removeEventListener('input', debounce(handleInput, 300), true);
  document.removeEventListener('change', handleChange, true);
  document.removeEventListener('scroll', debounce(handleScroll, 500), true);
  document.removeEventListener('keyup', debounce(handleKeyup, 1000), true);
  document.removeEventListener('select', debounce(handleSelect, 500), true);
}

// Event handlers
function handleClick(event) {
  if (!isRecording || captureInProgress) return;
  
  const target = event.target;
  const elementInfo = {
    tagName: target.tagName,
    id: target.id,
    className: target.className,
    textContent: target.textContent?.trim().substring(0, 50),
    href: target.href,
    type: target.type,
    eventType: 'click',
    path: getElementPath(target)
  };

  captureScreenshot('Click Event', elementInfo);
}

function handleInput(event) {
  if (!isRecording || captureInProgress) return;
  
  const target = event.target;
  if (target.type === 'password') return; // Skip password fields
  
  const elementInfo = {
    tagName: target.tagName,
    id: target.id,
    className: target.className,
    type: target.type,
    value: target.type !== 'password' ? target.value : '[REDACTED]',
    eventType: 'input',
    path: getElementPath(target)
  };

  captureScreenshot('Input Event', elementInfo);
}

function handleChange(event) {
  if (!isRecording || captureInProgress) return;
  
  const target = event.target;
  if (target.type === 'password') return; // Skip password fields
  
  const elementInfo = {
    tagName: target.tagName,
    id: target.id,
    className: target.className,
    type: target.type,
    value: target.type !== 'password' ? target.value : '[REDACTED]',
    eventType: 'change',
    path: getElementPath(target)
  };

  captureScreenshot('Change Event', elementInfo);
}

let scrollTimeout;
function handleScroll() {
  if (!isRecording || captureInProgress) return;
  
  // Debounce scroll events
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    captureScreenshot('Scroll Event', {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      eventType: 'scroll'
    });
  }, 500);
}

function handleKeyup(event) {
  if (!isRecording || captureInProgress) return;
  // Skip keyup events in password fields
  if (event.target.type === 'password') return;
  
  const target = event.target;
  const elementInfo = {
    tagName: target.tagName,
    id: target.id,
    className: target.className,
    type: target.type,
    eventType: 'keyup',
    path: getElementPath(target)
  };
  
  captureScreenshot('Text Edited', elementInfo);
}

function handleSelect(event) {
  if (!isRecording || captureInProgress) return;
  
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;
  
  const range = selection.getRangeAt(0);
  const elementInfo = {
    selectedText: selection.toString().substring(0, 100),
    eventType: 'select',
    path: getElementPath(range.commonAncestorContainer.parentElement)
  };
  
  captureScreenshot('Text Selected', elementInfo);
}

function captureScreenshot(eventType, details) {
  // Set flag to prevent multiple simultaneous capture attempts
  if (captureInProgress) {
    console.log('Screenshot capture already in progress, skipping...');
    return;
  }
  
  captureInProgress = true;
  console.log(`Capturing screenshot for ${eventType}...`);
  
  // Add timestamp to help with debugging
  details.timestamp = new Date().toISOString();
  
  // Create a title with useful information
  const title = `${eventType} - ${document.title} - ${formatTime(new Date())}`;
  
  try {
    chrome.runtime.sendMessage({
      action: 'captureScreenshot',
      title: title,
      url: window.location.href,
      details: details
    }, (response) => {
      captureInProgress = false;
      
      if (chrome.runtime.lastError) {
        console.error('Screenshot message error:', chrome.runtime.lastError);
        checkAndReconnect();
        return;
      }
      
      if (response && response.success) {
        console.log('Screenshot captured successfully');
      } else {
        console.error('Screenshot capture failed:', response?.error || 'Unknown error');
        
        // If we failed due to an auth issue, try to reauthenticate
        if (response?.error?.includes('not authenticated')) {
          checkAndReconnect();
        }
      }
    });
  } catch (error) {
    console.error('Error sending screenshot message:', error);
    captureInProgress = false;
    checkAndReconnect();
  }
}

function checkAndReconnect() {
  // Check auth state again
  try {
    chrome.runtime.sendMessage({ action: 'checkAuth' }, (authResponse) => {
      if (chrome.runtime.lastError) {
        console.error('Error checking auth after failure:', chrome.runtime.lastError);
        recordingInitialized = false;
        scheduleReconnect();
        return;
      }
      
      if (authResponse?.isAuthenticated && authResponse?.token) {
        console.log('Re-authenticated, setup recording again');
        recordingInitialized = false;
        setupRecording();
      }
    });
  } catch (e) {
    console.error('Error during reconnection:', e);
    recordingInitialized = false;
    scheduleReconnect();
  }
}

// Helper function to format time
function formatTime(date) {
  return date.toLocaleTimeString();
}

// Helper function to get element path for better identification
function getElementPath(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }
  
  const path = [];
  let currentNode = element;
  
  while (currentNode && currentNode.nodeType === Node.ELEMENT_NODE) {
    let selector = currentNode.nodeName.toLowerCase();
    
    if (currentNode.id) {
      selector += '#' + currentNode.id;
    } else if (currentNode.className && typeof currentNode.className === 'string') {
      selector += '.' + currentNode.className.trim().replace(/\s+/g, '.');
    }
    
    path.unshift(selector);
    currentNode = currentNode.parentNode;
  }
  
  return path.join(' > ');
}

// Utility function for debouncing events
function debounce(func, wait) {
  let timeout;
  
  // Return a unique function instance to ensure removeEventListener works properly
  const debouncedFn = function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
  
  return debouncedFn;
}

// Handle authentication state changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    // Check for both authentication flag and token changes
    const authChanged = changes.isAuthenticated || changes.token;
    
    if (authChanged) {
      try {
        chrome.storage.local.get(['isAuthenticated', 'token'], (result) => {
          const isAuthenticated = result.isAuthenticated;
          const hasToken = !!result.token;
          
          if (isAuthenticated && hasToken) {
            if (!recordingInitialized) {
              setupRecording();
            }
          } else {
            stopRecording();
            isRecording = false;
            if (port) {
              port.disconnect();
              port = null;
            }
            recordingInitialized = false;
          }
        });
      } catch (e) {
        console.error('Error handling auth state change:', e);
      }
    }
  }
});