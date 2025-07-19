import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "http://localhost:5173",
    "X-Title": process.env.APP_NAME || "OpenAI App",
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json()); 

app.use(express.static(path.join(__dirname, '../client/dist')));

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