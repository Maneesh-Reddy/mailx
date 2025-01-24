import { authenticateWithGoogle } from './utils/auth.js';
import { fetchGmailMessages } from './utils/email-fetcher.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginSection = document.getElementById('login-section');
    const emailSection = document.getElementById('email-section');
    const emailList = document.getElementById('email-list');

    // Handle Login
    loginBtn.addEventListener('click', async () => {
        try {
            const { token, userInfo } = await authenticateWithGoogle();
            console.log('Login successful:', userInfo);

            // Show email section
            loginSection.classList.add('hidden');
            emailSection.classList.remove('hidden');

            // Fetch and display emails
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

    // Handle Logout
    logoutBtn.addEventListener('click', () => {
        chrome.storage.sync.get(['authToken'], async ({ authToken }) => {
            if (!authToken) {
                alert('You are already logged out.');
                return;
            }

            chrome.identity.removeCachedAuthToken({ token: authToken }, () => {
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
