document.addEventListener('DOMContentLoaded', function () {
    const authContainer = document.getElementById('authContainer');
    const recordingContainer = document.getElementById('recordingContainer');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const clearBtn = document.getElementById('clearBtn');
    const screenshotsContainer = document.getElementById('screenshots');
    const authStatus = document.getElementById('authStatus');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const modalClose = document.querySelector('.modal-close');
    // Add save SOP button
    const saveSopBtn = document.createElement('button');
    saveSopBtn.id = 'saveSopBtn';
    saveSopBtn.textContent = 'Save as SOP';
    saveSopBtn.className = 'btn primary-btn';
    saveSopBtn.style.marginLeft = '10px';
    
    // Insert after clearBtn
    clearBtn.parentNode.insertBefore(saveSopBtn, clearBtn.nextSibling);

    function updateAuthState() {
        // Check chrome.storage.local first
        chrome.storage.local.get(['isAuthenticated', 'user', 'token'], function (result) {
            console.debug('Extension storage auth check:', result);

            if (chrome.runtime.lastError) {
                console.error('Storage error:', chrome.runtime.lastError);
                authStatus.textContent = 'Error checking auth status';
                return;
            }

            let isAuthenticated = result.isAuthenticated || false;
            let user = result.user || {};
            let token = result.token;

            if (!token) {
                // If token not found in extension storage, check if we can access the localStorage of the web page
                chrome.runtime.sendMessage({ action: 'checkLocalStorageToken' }, function (response) {
                    if (chrome.runtime.lastError) {
                        console.error('Error checking localStorage:', chrome.runtime.lastError);
                        updateUIWithAuthState(isAuthenticated, user, token);
                        return;
                    }

                    if (response && response.success && response.token) {
                        token = response.token;

                        // Try to extract user info from token (assuming JWT)
                        try {
                            const tokenParts = token.split('.');
                            if (tokenParts.length > 1) {
                                const payload = JSON.parse(atob(tokenParts[1]));
                                user = {
                                    name: payload.name || 'User',
                                    email: payload.email || '',
                                    _id: payload._id || ''
                                };
                                isAuthenticated = true;

                                // Save to extension storage for future use
                                chrome.storage.local.set({
                                    isAuthenticated: true,
                                    user: user,
                                    token: token
                                }, function () {
                                    console.log('Saved token from localStorage to extension storage');
                                });
                            }
                        } catch (e) {
                            console.error('Error parsing token from localStorage:', e);
                        }
                    }

                    updateUIWithAuthState(isAuthenticated, user, token);
                });
            } else {
                updateUIWithAuthState(isAuthenticated, user, token);
            }
        });
    }

    function updateUIWithAuthState(isAuthenticated, user, token) {
        // Simple token check - just verify it exists and is a string
        const validToken = token && typeof token === 'string' && token.trim() !== '';
        const validAuth = isAuthenticated && validToken;

        console.log(`Auth state: ${validAuth ? 'Authenticated' : 'Unauthenticated'}`, {
            isAuthenticated,
            tokenExists: !!token,
            validToken
        });

        authContainer.style.display = validAuth ? 'none' : 'block';
        recordingContainer.style.display = validAuth ? 'block' : 'none';

        if (validAuth) {
            authStatus.textContent = `Welcome back, ${user.name || 'User'}!`;

            // Force a slight delay to ensure storage is updated before reading screenshots
            setTimeout(() => {
                console.log('Updating screenshot display after authentication');
                updateScreenshotDisplay();
            }, 100);

            chrome.storage.local.get(['isRecording'], function (result) {
                const isRecording = result.isRecording || false;
                startBtn.disabled = isRecording;
                stopBtn.disabled = !isRecording;
            });
        } else {
            authStatus.textContent = 'Please login to start recording';
        }
    }

    function updateScreenshotDisplay() {
        console.log('Fetching screenshots from storage...');
        chrome.storage.local.get(['screenshots', 'isAuthenticated', 'token'], function (result) {
            // Log what we found in storage
            console.log('Storage state:', {
                isAuthenticated: !!result.isAuthenticated,
                hasToken: !!result.token,
                screenshotsCount: result.screenshots ? result.screenshots.length : 0
            });

            // Clear the container
            screenshotsContainer.innerHTML = '';
            const screenshots = result.screenshots || [];

            // Check if authenticated but no screenshots
            if (screenshots.length === 0) {
                const noScreenshots = document.createElement('div');
                noScreenshots.style.textAlign = 'center';
                noScreenshots.style.padding = '20px';
                noScreenshots.style.color = '#666';

                if (result.isAuthenticated && result.token) {
                    noScreenshots.textContent = 'No screenshots yet. Start recording to capture interactions.';
                } else {
                    noScreenshots.textContent = 'Please login to view and capture screenshots.';
                }

                screenshotsContainer.appendChild(noScreenshots);
                return;
            }

            // Process screenshots in reverse order (newest first)
            screenshots.reverse().forEach((screenshot, index) => {
                try {
                    const container = document.createElement('div');
                    container.className = 'screenshot-container';

                    const title = document.createElement('div');
                    title.className = 'screenshot-title';
                    title.textContent = screenshot.title || 'Screenshot';

                    const timestamp = document.createElement('div');
                    timestamp.className = 'screenshot-timestamp';
                    timestamp.textContent = new Date(screenshot.timestamp).toLocaleString();

                    // Add URL if available
                    if (screenshot.url) {
                        const urlDiv = document.createElement('div');
                        urlDiv.className = 'screenshot-url';
                        urlDiv.textContent = screenshot.url.substring(0, 50) + (screenshot.url.length > 50 ? '...' : '');
                        urlDiv.style.fontSize = '12px';
                        urlDiv.style.color = '#666';
                        urlDiv.style.marginBottom = '5px';
                        container.appendChild(urlDiv);
                    }

                    const img = document.createElement('img');
                    img.className = 'screenshot-image';
                    img.src = screenshot.imgData;
                    img.alt = screenshot.title || 'Screenshot';
                    img.loading = 'lazy';
                    img.style.width = '100%'; // Make images responsive

                    // Error handling for image loading
                    img.onerror = function () {
                        console.error('Failed to load image for screenshot:', screenshot.title);
                        img.alt = 'Failed to load image';
                        img.style.height = '100px';
                        img.style.background = '#f0f0f0';
                        img.style.display = 'flex';
                        img.style.justifyContent = 'center';
                        img.style.alignItems = 'center';
                        img.style.color = 'red';
                    };

                    // Add click handler for full-size view
                    img.addEventListener('click', () => {
                        modalImg.src = screenshot.imgData;
                        modal.style.display = 'block';
                        requestAnimationFrame(() => {
                            modal.classList.add('show');
                        });
                    });

                    container.appendChild(title);
                    container.appendChild(timestamp);
                    container.appendChild(img);
                    screenshotsContainer.appendChild(container);
                } catch (error) {
                    console.error('Error rendering screenshot:', error, screenshot);
                }
            });
        });
    }

    // Login button handler
    loginBtn.addEventListener('click', () => {
        // Store the current tab ID before opening the login page
        chrome.tabs.query({ active: true, currentWindow: true }, (currentTabs) => {
            const currentTabId = currentTabs[0].id;
            
            // Store this ID in storage so we can come back to it
            chrome.storage.local.set({ previousTabId: currentTabId }, () => {
                // Now open the login page
                chrome.tabs.create({ url: 'http://localhost:3000/login' }, (loginTab) => {
                    // Listen for tab updates to detect when login is complete
                    const tabUpdateListener = (tabId, changeInfo) => {
                        // Check if this is our login tab and it has completed loading
                        if (tabId === loginTab.id && changeInfo.status === 'complete') {
                            // Wait a moment for any localStorage changes to finalize
                            setTimeout(() => {
                                // Check if login was successful by checking localStorage
                                chrome.runtime.sendMessage({ action: 'checkLocalStorageToken' }, function(response) {
                                    if (response && response.success && response.token) {
                                        console.log('Login detected, token found');

                                        // Extract user info from token (assuming JWT)
                                        try {
                                            const tokenParts = response.token.split('.');
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
                                                    token: response.token
                                                }, function() {
                                                    console.log('Successfully saved auth data after login');
                                                    
                                                    // Return to previous tab and close login tab
                                                    chrome.storage.local.get(['previousTabId'], function(result) {
                                                        if (result.previousTabId) {
                                                            // First activate the previous tab
                                                            chrome.tabs.update(result.previousTabId, { active: true }, () => {
                                                                // Then close the login tab
                                                                chrome.tabs.remove(loginTab.id, () => {
                                                                    console.log('Returned to previous tab after login');
                                                                });
                                                            });
                                                        }
                                                    });
                                                });
                                            }
                                        } catch (e) {
                                            console.error('Error parsing token:', e);
                                        }

                                        // Remove the listener once we've processed the login
                                        chrome.tabs.onUpdated.removeListener(tabUpdateListener);
                                    }
                                });
                            }, 500);
                        }
                    };

                    // Start listening for tab updates
                    chrome.tabs.onUpdated.addListener(tabUpdateListener);
                });
            });
        });
    });

    // Signup button handler
    signupBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'http://localhost:3000/signup' });
    });

    // Manage SOPs button handler
    const manageSopBtn = document.getElementById('manageSopBtn');
    manageSopBtn.addEventListener('click', () => {
        // Get all screenshots from storage
        chrome.storage.local.get(['screenshots'], function (result) {
            const screenshots = result.screenshots || [];

            if (screenshots.length > 0) {
                console.log(`Sending ${screenshots.length} screenshots to manage-sop page`);

                // Prepare data to send - include the image data for display
                const screenshotData = screenshots.map(screenshot => ({
                    title: screenshot.title || 'Untitled Screenshot',
                    timestamp: screenshot.timestamp,
                    url: screenshot.url,
                    imgData: screenshot.imgData, // Include the actual screenshot image data
                    details: screenshot.details || {}
                }));

                // Store the data in localStorage for the web app to access
                // This is more reliable than URL parameters for larger datasets
                localStorage.setItem('sopify_screenshots', JSON.stringify(screenshotData));

                // Open the manage-sop page with a flag indicating data is available
                chrome.tabs.create({
                    url: 'http://localhost:3000/manage-sop?source=extension&hasData=true'
                });
            } else {
                // If no screenshots, just open the page normally
                chrome.tabs.create({ url: 'http://localhost:3000/manage-sop' });
            }
        });
    });

    // Start recording
    startBtn.addEventListener('click', () => {
        chrome.storage.local.get(['isAuthenticated', 'token'], function (result) {
            if (!result.isAuthenticated || !result.token) {
                authStatus.textContent = 'Please login to start recording';
                return;
            }

            chrome.runtime.sendMessage({
                action: 'toggleRecording',
                enabled: true
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error starting recording:', chrome.runtime.lastError);
                    return;
                }
                if (response && response.success) {
                    startBtn.disabled = true;
                    stopBtn.disabled = false;
                    authStatus.textContent = 'Recording active';
                }
            });
        });
    });

    // Stop recording
    stopBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({
            action: 'toggleRecording',
            enabled: false
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error stopping recording:', chrome.runtime.lastError);
                return;
            }
            if (response && response.success) {
                startBtn.disabled = false;
                stopBtn.disabled = true;
                authStatus.textContent = 'Recording stopped';
            }
        });
    });

    // Clear all screenshots
    clearBtn.addEventListener('click', () => {
        chrome.storage.local.get(['isAuthenticated', 'token'], function (result) {
            if (!result.isAuthenticated || !result.token) {
                authStatus.textContent = 'Please login to manage screenshots';
                return;
            }

            if (confirm('Are you sure you want to clear all screenshots? This action cannot be undone.')) {
                chrome.storage.local.set({ screenshots: [] }, () => {
                    updateScreenshotDisplay();
                });
            }
        });
    });

    // Save SOP to database
    saveSopBtn.addEventListener('click', () => {
        chrome.storage.local.get(['screenshots', 'isAuthenticated', 'user', 'token'], function (result) {
            const screenshots = result.screenshots || [];
            const token = result.token;
            const user = result.user || {};
            
            if (!result.isAuthenticated || !token) {
                authStatus.textContent = 'Please login to save SOP';
                return;
            }
            
            if (screenshots.length === 0) {
                alert('No screenshots to save. Capture some actions first!');
                return;
            }
            
            // Show save SOP dialog
            const sopTitle = prompt('Enter a title for your SOP:', 'My Process');
            if (!sopTitle) return; // User cancelled
            
            const sopDescription = prompt('Enter a description:', 'Process captured with Sopify extension');
            if (!sopDescription) return; // User cancelled
            
            // Prepare SOP data
            const sopData = {
                title: sopTitle,
                description: sopDescription,
                steps: screenshots.map(screenshot => ({
                    title: screenshot.title || 'Step',
                    description: '',
                    imgData: screenshot.imgData,
                    url: screenshot.url,
                    timestamp: screenshot.timestamp,
                    details: screenshot.details || {}
                })),
                fromExtension: true,
                timestamp: Date.now(),
                createdBy: user._id
            };
            
            // Send to server
            fetch('https://sopify.onrender.com/sops/add-from-extension', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sopData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server returned ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    authStatus.textContent = 'SOP saved successfully!';
                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-message';
                    successMsg.textContent = 'SOP saved successfully!';
                    successMsg.style.backgroundColor = '#4CAF50';
                    successMsg.style.color = 'white';
                    successMsg.style.padding = '10px';
                    successMsg.style.borderRadius = '4px';
                    successMsg.style.marginTop = '10px';
                    successMsg.style.textAlign = 'center';
                    
                    // Insert at top of screenshots container
                    if (screenshotsContainer.firstChild) {
                        screenshotsContainer.insertBefore(successMsg, screenshotsContainer.firstChild);
                    } else {
                        screenshotsContainer.appendChild(successMsg);
                    }
                    
                    // Remove after 3 seconds
                    setTimeout(() => {
                        successMsg.remove();
                    }, 3000);
                } else {
                    throw new Error(data.message || 'Failed to save SOP');
                }
            })
            .catch(error => {
                console.error('Error saving SOP:', error);
                authStatus.textContent = 'Error: ' + error.message;
            });
        });
    });

    // Modal close handlers with smooth transition
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Match the CSS transition duration
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle escape key for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local') {
            if (changes.isAuthenticated || changes.user || changes.token) {
                console.log('Auth state changed, updating UI');
                updateAuthState();
            }
            if (changes.screenshots) {
                console.log('Screenshots changed, updating display');
                updateScreenshotDisplay();
            }
            if (changes.isRecording) {
                chrome.storage.local.get(['isRecording'], function (result) {
                    const isRecording = result.isRecording || false;
                    startBtn.disabled = isRecording;
                    stopBtn.disabled = !isRecording;
                    authStatus.textContent = isRecording ? 'Recording active' : 'Ready to record';
                });
            }
        }
    });

    // Listen for screenshot captured events from service worker
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'screenshotCaptured') {
            console.log('New screenshot captured, updating display');
            updateScreenshotDisplay();
        }
        if (message.action === 'authStateChanged') {
            console.log('Auth state changed via message, updating UI');
            updateAuthState();
        }
    });

    // Initialize state
    updateAuthState();
});