const express = require('express');
const bodyParser = require('body-parser');
const openai = require('openai');

// Initialize the OpenAI API client
openai.apiKey = 'YOUR_OPENAI_API_KEY';  // Replace with your OpenAI API key

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve the static HTML file
app.use(express.static('public'));

// API endpoint to process user input and get a response from OpenAI
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo',  // Or 'gpt-4' if you want the latest version
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const gptResponse = response.choices[0].message.content;
    res.json({ response: gptResponse });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Error contacting OpenAI API' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
