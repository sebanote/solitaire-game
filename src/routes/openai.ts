import express from 'express';
import { OpenAiService } from '../infrastructure/openai/openAiService';

export const openaiRouter = express.Router();

openaiRouter.get('/generate-level', async (req, res) => {
  try {
    console.log('HIT THE GENERATE-LEVEL ENDPOINT')
    const service = new OpenAiService();
    const level = await service.generateLevel();
    res.json(level);
  } catch (error) {
    console.error('Error generating level:', error);
    res.status(500).json({ error: 'Error generating level' });
  }
});