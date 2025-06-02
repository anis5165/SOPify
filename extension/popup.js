document.addEventListener('DOMContentLoaded', () => {
  // Get all UI elements
  const authButtons = document.getElementById('authButtons');
  const recordingControls = document.getElementById('recordingControls');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const startBtn = document.getElementById('startRecording');
  const stopBtn = document.getElementById('stopRecording');
  const openSidePanelBtn = document.getElementById('openSidePanel');
  const statusDiv = document.getElementById('status');

  function updateStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.style.color = isError ? '#dc3545' : '#666';
    console.log(`Status update: ${message}`);
  }

  function checkAuthState() {
    chrome.storage.local.get(['isAuthenticated', 'token'], (result) => {
      const isAuthenticated = result.isAuthenticated || false;
      const token = result.token;
      
      // Both isAuthenticated flag and token must be present
      const validAuth = isAuthenticated && token;
      
      authButtons.style.display = validAuth ? 'none' : 'flex';
      recordingControls.style.display = validAuth ? 'flex' : 'none';
      
      if (validAuth) {
        chrome.storage.local.get(['isRecording'], (result) => {
          const isRecording = result.isRecording || false;
          startBtn.disabled = isRecording;
          stopBtn.disabled = !isRecording;
          
          if (isRecording) {
            updateStatus('Recording is active');
          } else {
            updateStatus('Ready to record');
          }
        });
      } else {
        updateStatus('Please login to use the extension');
      }
    });
  }

  // Login button click handler
  loginBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000/login' });
    window.close();
  });

  // Signup button click handler
  signupBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000/signup' });
    window.close();
  });

  // Start recording
  startBtn.addEventListener('click', async () => {
    try {
      // First check if user is authenticated with token
      const authResult = await new Promise(resolve => {
        chrome.storage.local.get(['isAuthenticated', 'token'], resolve);
      });
      
      if (!authResult.isAuthenticated || !authResult.token) {
        updateStatus('Authentication required', true);
        return;
      }
      
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        throw new Error('No active tab found');
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          console.log('Injected recording script');
          return true;
        }
      });

      chrome.runtime.sendMessage({ 
        action: 'toggleRecording', 
        enabled: true 
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Toggle error:', chrome.runtime.lastError);
          updateStatus('Error starting recording', true);
          return;
        }
        
        if (response?.success) {
          startBtn.disabled = true;
          stopBtn.disabled = false;
          updateStatus('Recording started');
        } else {
          updateStatus('Failed to start recording', true);
        }
      });
      
    } catch (error) {
      console.error('Start error:', error);
      updateStatus('Error: ' + error.message, true);
    }
  });

  // Stop recording
  stopBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ 
      action: 'toggleRecording', 
      enabled: false 
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Toggle error:', chrome.runtime.lastError);
        updateStatus('Error stopping recording', true);
        return;
      }

      if (response?.success) {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        updateStatus('Recording stopped');
      } else {
        updateStatus('Failed to stop recording', true);
      }
    });
  });

  // Open side panel
  openSidePanelBtn.addEventListener('click', async () => {
    try {
      if (chrome.sidePanel) {
        await chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
        updateStatus('Opening side panel...');
      } else {
        throw new Error('Side panel not supported');
      }
    } catch (error) {
      console.error('Side panel error:', error);
      updateStatus('Error opening side panel', true);
    }
  });

  // Check authentication state when popup opens
  checkAuthState();

  // Listen for auth state changes
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.isAuthenticated || changes.token || changes.isRecording) {
      checkAuthState();
    }
  });
});

// Add this function to popup.js after the checkAuthState function

function checkLocalStorageToken() {
  // First check if we already have a token in extension storage
  chrome.storage.local.get(['isAuthenticated', 'token'], (result) => {
    const isAuthenticated = result.isAuthenticated || false;
    const token = result.token || null;
    
    // If already authenticated with token, no need to check localStorage
    if (isAuthenticated && token) {
      return;
    }
    
    // Request background script to check localStorage in the active tab
    chrome.runtime.sendMessage({ action: 'checkLocalStorageToken' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error checking localStorage token:', chrome.runtime.lastError);
        return;
      }
      
      if (response && response.success && response.token) {
        const localToken = response.token;
        
        // Try to parse JWT token to extract user info
        try {
          const tokenParts = localToken.split('.');
          if (tokenParts.length > 1) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const user = {
              name: payload.name || 'User',
              email: payload.email || '',
              _id: payload._id || ''
            };
            
            // Save to extension storage
            chrome.storage.local.set({
              isAuthenticated: true,
              user: user,
              token: localToken
            }, () => {
              console.log('Token saved from localStorage to extension');
              checkAuthState(); // Refresh UI based on new auth state
            });
          }
        } catch (e) {
          console.error('Error parsing token from localStorage:', e);
        }
      }
    });
  });
}

// Add this line at the end of the DOMContentLoaded event handler
checkLocalStorageToken();