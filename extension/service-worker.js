// This file was previously named service-worker.js but referenced as background.js in manifest
let isRecording = false;
let connectedTabs = new Set();

// Handle the extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  chrome.storage.local.set({ 
    isRecording: false, 
    screenshots: [],
    isAuthenticated: false,
    user: null,
    token: null
  });
});

// Handle messages from the Next.js app for authentication
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  console.log('External message received:', request);
  
  if (request.action === 'authenticate') {
    chrome.storage.local.set({ 
      isAuthenticated: true,
      user: request.user,
      token: request.token
    }, () => {
      // Notify all extension views
      chrome.runtime.sendMessage({
        action: 'authStateChanged',
        isAuthenticated: true,
        user: request.user,
        token: request.token
      });
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'logout') {
    chrome.storage.local.set({ 
      isAuthenticated: false,
      user: null,
      token: null,
      screenshots: [],
      isRecording: false
    }, () => {
      // Stop recording in all tabs
      Array.from(connectedTabs).forEach(tabId => {
        try {
          chrome.tabs.sendMessage(tabId, {
            action: 'recordingStateChanged',
            enabled: false
          });
        } catch (error) {
          console.error('Error notifying tab:', tabId, error);
          connectedTabs.delete(tabId);
        }
      });
      
      // Notify all extension views
      chrome.runtime.sendMessage({
        action: 'authStateChanged',
        isAuthenticated: false
      });
      
      sendResponse({ success: true });
    });
    return true;
  }
});

// Handle new tab connections
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'content-script') {
    const tabId = port.sender.tab.id;
    console.log('Tab connected:', tabId);
    connectedTabs.add(tabId);

    port.onDisconnect.addListener(() => {
      console.log('Tab disconnected:', tabId);
      connectedTabs.delete(tabId);
    });

    // Send initial state
    port.postMessage({ action: 'recordingStateChanged', enabled: isRecording });
  }
});

// Handle content script messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);

  if (request.action === 'checkAuth') {
    chrome.storage.local.get(['isAuthenticated', 'user', 'token'], (result) => {
      sendResponse({ 
        isAuthenticated: result.isAuthenticated || false,
        user: result.user || null,
        token: result.token || null
      });
    });
    return true;
  }

  if (request.action === 'contentScriptReady') {
    if (sender.tab?.id) {
      connectedTabs.add(sender.tab.id);
      chrome.storage.local.get(['isAuthenticated', 'isRecording'], (result) => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'recordingStateChanged',
          enabled: result.isAuthenticated && result.isRecording
        }).catch(error => {
          console.log('Error sending message to tab:', error);
        });
      });
    }
    sendResponse({ success: true });
    return true;
  }

  if (request.action === 'captureScreenshot') {
    console.log('Processing screenshot capture request');
    chrome.storage.local.get(['isAuthenticated', 'token'], (result) => {
      // Log authentication status
      console.log('Authentication check for screenshot capture:', {
        isAuthenticated: !!result.isAuthenticated,
        hasToken: !!result.token
      });
      
      if (!result.isAuthenticated || !result.token) {
        console.error('Screenshot capture rejected: User not authenticated');
        sendResponse({ error: 'User not authenticated' });
        return;
      }

      // Get the active tab ID
      const activeTabId = sender.tab?.id;
      if (!activeTabId) {
        console.error('Screenshot capture rejected: No active tab found');
        sendResponse({ error: 'No active tab found' });
        return;
      }

      try {
        console.log('Attempting to capture screenshot from tab:', activeTabId);
        // Ensure we're capturing from the right tab
        chrome.tabs.get(activeTabId, (tab) => {
          if (chrome.runtime.lastError) {
            console.error('Tab error:', chrome.runtime.lastError);
            sendResponse({ error: chrome.runtime.lastError.message });
            return;
          }
          
          // Wait a small amount to ensure the DOM is fully rendered
          setTimeout(() => {
            // Use captureVisibleTab with the correct window ID
            chrome.tabs.captureVisibleTab(
              tab.windowId, 
              { format: 'png', quality: 100 }, 
              (dataUrl) => {
                if (chrome.runtime.lastError) {
                  console.error('Screenshot error:', chrome.runtime.lastError);
                  sendResponse({ error: chrome.runtime.lastError.message });
                  return;
                }

                if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
                  console.error('Invalid screenshot data:', typeof dataUrl);
                  sendResponse({ error: 'Invalid screenshot data' });
                  return;
                }

                // Successfully captured screenshot
                console.log('Screenshot captured successfully, size:', Math.round(dataUrl.length / 1024), 'KB');

                chrome.storage.local.get(['screenshots'], (result) => {
                  let screenshots = result.screenshots || [];
                  
                  // Ensure screenshots is an array
                  if (!Array.isArray(screenshots)) {
                    console.warn('Screenshots was not an array, resetting');
                    screenshots = [];
                  }
                  
                  // Add the new screenshot
                  const newScreenshot = {
                    imgData: dataUrl,
                    timestamp: Date.now(),
                    title: request.title || 'Screenshot',
                    url: request.url,
                    details: request.details || {}
                  };
                  
                  screenshots.push(newScreenshot);
                  
                  // Limit to 50 screenshots to prevent storage issues
                  if (screenshots.length > 50) {
                    screenshots = screenshots.slice(-50);
                  }

                  // Save to storage
                  chrome.storage.local.set({ screenshots }, () => {
                    if (chrome.runtime.lastError) {
                      console.error('Error saving screenshot to storage:', chrome.runtime.lastError);
                      sendResponse({ error: 'Failed to save screenshot: ' + chrome.runtime.lastError.message });
                      return;
                    }
                    
                    console.log('Screenshot saved to storage, total count:', screenshots.length);
                    
                    // Notify sidepanel about new screenshot
                    chrome.runtime.sendMessage({
                      action: 'screenshotCaptured',
                      screenshotCount: screenshots.length
                    });
                    
                    sendResponse({ success: true });
                  });
                });
              }
            );
          }, 100); // Small delay to ensure UI is stable
        });
      } catch (error) {
        console.error('Screenshot capture failed:', error);
        sendResponse({ error: 'Screenshot capture failed: ' + error.message });
      }
    });
    return true;
  }

  if (request.action === 'toggleRecording') {
    chrome.storage.local.get(['isAuthenticated', 'token'], (result) => {
      if (!result.isAuthenticated || !result.token) {
        sendResponse({ error: 'User not authenticated' });
        return;
      }

      isRecording = request.enabled;
      chrome.storage.local.set({ isRecording });

      // Make sure content script is injected in all tabs before sending recording state
      if (isRecording) {
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            // Skip chrome:// URLs as they can't be injected
            if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
              }).then(() => {
                chrome.tabs.sendMessage(tab.id, {
                  action: 'recordingStateChanged',
                  enabled: isRecording
                }).catch(err => console.log(`Message error for tab ${tab.id}: ${err}`));
              }).catch(err => console.log(`Injection error for tab ${tab.id}: ${err}`));
            }
          });
        });
      } else {
        // Stop recording in all connected tabs
        Array.from(connectedTabs).forEach(tabId => {
          try {
            chrome.tabs.sendMessage(tabId, {
              action: 'recordingStateChanged',
              enabled: isRecording
            }).catch(err => console.log(`Message error for tab ${tabId}: ${err}`));
          } catch (error) {
            console.error('Error notifying tab:', tabId, error);
            connectedTabs.delete(tabId);
          }
        });
      }

      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'checkLocalStorageToken') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (!tabs || !tabs[0]) {
        sendResponse({success: false, error: 'No active tab'});
        return;
      }
      
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: () => {
          return localStorage.getItem('token');
        }
      }).then(results => {
        if (results && results[0] && results[0].result) {
          sendResponse({success: true, token: results[0].result});
        } else {
          sendResponse({success: false, error: 'No token found'});
        }
      }).catch(error => {
        sendResponse({success: false, error: error.message || 'Script execution failed'});
      });
    });
    
    return true; // Keep the message channel open for async response
  }

  // Default response for unknown actions
  if (!request.action || !['checkAuth', 'contentScriptReady', 'captureScreenshot', 'toggleRecording', 'checkLocalStorageToken'].includes(request.action)) {
    sendResponse({ error: 'Unknown action' });
  }
  
  return true; // Keep the message channel open for async response
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  connectedTabs.delete(tabId);
});

// Listen for tab updates to sync token from localStorage to extension storage
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only act when page is fully loaded and URL matches our web app
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http://localhost:3000')) {
    
    // Execute script to check localStorage for token
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        return localStorage.getItem('token');
      }
    }).then(results => {
      if (results && results[0] && results[0].result) {
        const token = results[0].result;
        
        // Verify token exists and save to extension storage
        if (token) {
          // Try to extract user info from token (assuming JWT)
          try {
            const tokenParts = token.split('.');
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
                token: token
              }, () => {
                console.log('Token synced from web app to extension');
                
                // Notify all extension views about auth state change
                chrome.runtime.sendMessage({
                  action: 'authStateChanged',
                  isAuthenticated: true,
                  user: user,
                  token: token
                });
              });
            }
          } catch (e) {
            console.error('Error parsing token from localStorage:', e);
          }
        }
      }
    }).catch(error => {
      console.error('Error executing script:', error);
    });
  }

  // Check if we need to inject content script in this tab
  if (changeInfo.status === 'complete') {
    chrome.storage.local.get(['isAuthenticated', 'isRecording'], (result) => {
      if (result.isAuthenticated && result.isRecording) {
        // Skip chrome:// URLs as they can't be injected
        if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
          console.log(`Injecting content script into updated tab: ${tab.id} (${tab.url})`);
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          }).then(() => {
            console.log(`Successfully injected content script into tab ${tab.id}`);
            // Send recording state message to the tab
            chrome.tabs.sendMessage(tab.id, {
              action: 'recordingStateChanged',
              enabled: true
            }).catch(err => console.log(`Message error after injection: ${err}`));
          }).catch(err => {
            console.error(`Failed to inject content script into tab ${tab.id}: ${err}`);
          });
        }
      }
    });
  }
});