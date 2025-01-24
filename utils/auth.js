async function authenticateWithGoogle() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        
        fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`)
          .then(response => response.json())
          .then(userInfo => {
            chrome.storage.sync.set({
              authToken: token,
              userProfile: userInfo
            });
            resolve({ token, userInfo });
          })
          .catch(reject);
      });
    });
  }