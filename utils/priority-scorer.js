function calculateEmailPriority(email) {
    let score = 0;
    
    // Extract email body and date
    const emailBody = decodeEmailBody(email);
    const emailDate = new Date(email.internalDate);
    
    // Recency scoring
    const daysSinceReceived = (Date.now() - emailDate) / (1000 * 3600 * 24);
    if (daysSinceReceived < 7) score += 10;
    
    // Keyword detection
    const priorityKeywords = [
      'urgent', 'deadline', 'important', 
      'interview', 'offer', 'invitation'
    ];
    
    priorityKeywords.forEach(keyword => {
      if (emailBody.toLowerCase().includes(keyword)) {
        score += 5;
      }
    });
    
    return score;
  }
  
  function decodeEmailBody(email) {
    // Logic to extract readable body from Gmail API response
    // This is a placeholder and needs actual implementation
    return email.snippet || '';
  }