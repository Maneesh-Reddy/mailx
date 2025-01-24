document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const loginSection = document.getElementById('login-section');
    const emailSection = document.getElementById('email-section');
  
    loginBtn.addEventListener('click', async () => {
      try {
        const { token, userInfo } = await authenticateWithGoogle();
        loginSection.style.display = 'none';
        emailSection.style.display = 'block';
        
        // Fetch and render emails
        const emails = await fetchGmailMessages(token);
        renderEmailList(emails);
      } catch (error) {
        console.error('Authentication failed', error);
      }
    });
  });
  
  function renderEmailList(emails) {
    const emailList = document.getElementById('email-list');
    emails.forEach(email => {
      const emailItem = document.createElement('div');
      emailItem.classList.add('email-item');
      emailItem.innerHTML = `
        <h3>${getEmailSubject(email)}</h3>
        <p>Priority: ${calculateEmailPriority(email)}</p>
        <p>${getEmailSnippet(email)}</p>
      `;
      emailList.appendChild(emailItem);
    });
  }async function fetchAndDisplayEmails() {
    try {
      // Retrieve stored auth token
      const { authToken } = await chrome.storage.sync.get('authToken');
      
      // Fetch emails
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20', 
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      
      const messageList = await response.json();
      
      // Fetch details for each message
      const emailDetails = await Promise.all(
        messageList.messages.map(async (message) => {
          const detailResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, 
            {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            }
          );
          return detailResponse.json();
        })
      );
      
      // Extract and display subjects
      const emailList = document.getElementById('email-list');
      emailList.innerHTML = ''; // Clear previous emails
      
      emailDetails.forEach(email => {
        // Find subject header
        const subjectHeader = email.payload.headers.find(
          header => header.name === 'Subject'
        );
        
        const subject = subjectHeader ? subjectHeader.value : 'No Subject';
        
        // Create email item
        const emailItem = document.createElement('div');
        emailItem.classList.add('email-item');
        emailItem.textContent = subject;
        
        emailList.appendChild(emailItem);
      });
    } catch (error) {
      console.error('Error fetching emails:', error);
      document.getElementById('email-list').textContent = 'Failed to fetch emails';
    }
  }
  
  // Modify login button event listener
  loginBtn.addEventListener('click', async () => {
    try {
      const { token, userInfo } = await authenticateWithGoogle();
      loginSection.style.display = 'none';
      emailSection.style.display = 'block';
      
      // Fetch and display emails
      await fetchAndDisplayEmails();
    } catch (error) {
      console.error('Authentication failed', error);
    }
  });