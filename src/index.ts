/* global process */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';



import { openaiRouter } from './routes/openai';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', 
  }));
app.use(express.json());

app.use('/api', openaiRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en http://localhost:${PORT}`);
});