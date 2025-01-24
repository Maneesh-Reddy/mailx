// Enhance background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'login') {
      chrome.identity.getAuthToken({ 
        interactive: true,
        scopes: [
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/userinfo.email'
        ]
      }, (token) => {
        if (chrome.runtime.lastError) {
          sendResponse({ 
            success: false, 
            error: chrome.runtime.lastError 
          });
          return;
        }
        
        // Fetch user profile and email details
        fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`)
          .then(response => response.json())
          .then(userInfo => {
            // Store token and user info securely
            chrome.storage.sync.set({
              authToken: token,
              userProfile: userInfo
            });
            
            sendResponse({ 
              success: true, 
              user: userInfo 
            });
          })
          .catch(error => {
            sendResponse({ 
              success: false, 
              error: error.message 
            });
          });
      });
      return true; // Enable async response
    }
  });