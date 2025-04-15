const express = require('express');
const axios = require('axios');
const router = express.Router();

const openaiApiKey = process.env.OPENAI_API_KEY;  // Use environment variables to securely store the API key

router.post('/', async (req, res) => {  // Handle POST to /api/chat
  try {
    const { userInput } = req.body;

    // API request to OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',  // Model type (adjust if necessary) 
        prompt: userInput,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ answer: response.data.choices[0].text.trim() });  // Send the AI response to the client
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

module.exports = router;
