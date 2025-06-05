// api/webhook.js
export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user's query from Dialogflow
    const query = req.body.queryResult.queryText.toLowerCase();
    
    // Your knowledge base
    const knowledgeBase = {
      "hello": "Hello! How can I help you today?",
      "what is your name": "I'm a helpful assistant created for this knowledge base.",
      "how do i reset password": "To reset your password, go to Settings > Account > Reset Password and follow the instructions.",
      "business hours": "We're open Monday-Friday, 9 AM to 5 PM EST.",
      "contact": "You can reach us at support@example.com or call (555) 123-4567.",
      "pricing": "Our basic plan starts at $9.99/month. Visit our pricing page for more details.",
      "help": "I can help you with account questions, business hours, pricing, and general support. What would you like to know?"
    };

    // Simple keyword matching
    let response = "I'm sorry, I don't have information about that. Try asking about our business hours, pricing, or how to reset your password.";
    
    // Look for exact matches first
    if (knowledgeBase[query]) {
      response = knowledgeBase[query];
    } else {
      // Look for partial matches
      for (const [key, value] of Object.entries(knowledgeBase)) {
        if (query.includes(key) || key.includes(query)) {
          response = value;
          break;
        }
      }
    }

    // Return response in Dialogflow format
    res.json({
      fulfillmentText: response,
      fulfillmentMessages: [
        {
          text: {
            text: [response]
          }
        }
      ]
    });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      fulfillmentText: "Sorry, I'm having technical difficulties. Please try again later."
    });
  }
}