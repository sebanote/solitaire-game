import 'dotenv/config';

import express from 'express';
import { GameGenerator } from './gameGenerator';

const app = express();
const gameGenerator = new GameGenerator();

app.use(express.json());

// Endpoint to generate a game or set of levels
app.post('/generate-game', async (req, res) => {
    try {
        const config = req.body;

        // Initialize openai session by getting the greetings message
        const defaultGame = await gameGenerator.generateGame(config.language);

        res.status(200).json({
            defaultGame
        });
    } catch (error) {
        console.error('Error generating game:', error);
        res.status(500).json({ error: 'Failed to generate game.' });
    }
});

// Endpoint to chat with AI for game configuration refinement
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const aiResponse = await gameGenerator.configGameThroughChat(message);
        res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error('Error in chat:', error);
        res.status(500).json({ error: 'Failed to process chat message.' });
    }
});

// Start the API server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Game Generator API is running on port ${PORT}`);
});
