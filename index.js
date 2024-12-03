const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Initialize dotenv to use the .env file
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to send the message to OpenAI and get a response
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: userMessage,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const gptResponse = response.data.choices[0].text.trim();
    res.json({ reply: gptResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error connecting to OpenAI API' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
