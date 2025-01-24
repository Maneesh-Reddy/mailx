async function renderEmailList() {
    const { authToken } = await chrome.storage.sync.get('authToken');
    const emails = await fetchGmailMessages(authToken);
    
    const emailList = emails.map(email => {
      const priority = calculateEmailPriority(email);
      return {
        id: email.id,
        subject: getEmailSubject(email),
        priority,
        date: new Date(email.internalDate)
      };
    }).sort((a, b) => b.priority - a.priority);
    
    // Render to popup
    const listContainer = document.getElementById('email-list');
    emailList.forEach(email => {
      const emailItem = document.createElement('div');
      emailItem.innerHTML = `
        <h3>${email.subject}</h3>
        <p>Priority: ${email.priority}</p>
      `;
      listContainer.appendChild(emailItem);
    });
  }