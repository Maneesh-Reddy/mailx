document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginSection = document.getElementById('login-section');
    const emailSection = document.getElementById('email-section');
    const emailList = document.getElementById('email-list');
  
    // Login Event
    loginBtn.addEventListener('click', async () => {
      try {
        const { token, userInfo } = await authenticateWithGoogle();
        console.log('Authentication successful:', userInfo);
  
        loginSection.classList.add('hidden');
        emailSection.classList.remove('hidden');
  
        const emails = await fetchGmailMessages(token);
        emailList.innerHTML = emails
          .map(
            (email) => `
              <div class="email-item">
                <h3>${email.subject}</h3>
                <p>${new Date(parseInt(email.internalDate)).toLocaleString()}</p>
              </div>
            `
          )
          .join('');
      } catch (error) {
        console.error('Login failed:', error);
        alert(error.message);
      }
    });
  
    // Logout Event
    logoutBtn.addEventListener('click', () => {
      chrome.storage.sync.get(['authToken'], async ({ authToken }) => {
        if (!authToken) {
          alert('You are already logged out.');
          return;
        }
  
        chrome.identity.removeCachedAuthToken({ token: authToken }, async () => {
          try {
            await fetch(`https://oauth2.googleapis.com/revoke?token=${authToken}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            console.log('Token revoked successfully.');
          } catch (error) {
            console.error('Error revoking token:', error);
          }
  
          chrome.storage.sync.set({ authToken: null }, () => {
            loginSection.classList.remove('hidden');
            emailSection.classList.add('hidden');
            emailList.innerHTML = '';
            alert('Logged out successfully.');
          });
        });
      });
    });
  });
  