async function fetchGmailMessages(authToken) {
    try {
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50', 
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      
      const messageList = await response.json();
      return Promise.all(
        messageList.messages.map(async (message) => {
          const details = await fetchMessageDetails(authToken, message.id);
          return details;
        })
      );
    } catch (error) {
      console.error('Email fetch error:', error);
      return [];
    }
  }
  
  async function fetchMessageDetails(authToken, messageId) {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`, 
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    return await response.json();
  }