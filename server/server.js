import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173", // Replace with your client's URL
    "X-Title": "OpenAI App", // Replace with your app's name
  },
});

const app = express();
app.use(cors());
app.use(express.json()); 

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Codex',
  })
});

app.post('/', async (req, res) => { 
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: 'user', content: prompt }],
      temperature: 0, // Higher values means the model will take more risks.    
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096). 
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling            
      frequency_penalty: 0.0, // An additional penalty for each consecutive token in the already
      presence_penalty: 0, // An additional penalty for each token that appears in the text so far
    }); 
    res.status(200).send({
      bot: response.choices[0].message.content,
    })  

    } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(5000, () => 
    console.log('AI server started on port http://localhost:5000'));