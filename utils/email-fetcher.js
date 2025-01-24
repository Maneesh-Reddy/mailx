export async function fetchGmailMessages(authToken) {
    try {
        const response = await fetch(
            'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20',
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        if (!response.ok) throw new Error('Failed to fetch messages.');

        const messageList = await response.json();
        if (!messageList.messages) return [];

        return await Promise.all(
            messageList.messages.map(async (message) => {
                const detailResponse = await fetch(
                    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                if (!detailResponse.ok) throw new Error('Failed to fetch message details.');

                const email = await detailResponse.json();
                const subjectHeader = email.payload.headers.find((h) => h.name === 'Subject');
                return {
                    id: message.id,
                    subject: subjectHeader ? subjectHeader.value : 'No Subject',
                    internalDate: email.internalDate,
                };
            })
        );
    } catch (error) {
        console.error('Error fetching Gmail messages:', error);
        return [];
    }
}
