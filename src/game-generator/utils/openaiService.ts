import OpenAI  from 'openai';
import { ai_gen } from './types';


export class OpenAIService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    async chat(message: string, previousResponseId: string | null | undefined): Promise<ai_gen> {
        try {
            const response = await this.openai.responses.create({
                model: 'gpt-4.1',
                previous_response_id: previousResponseId,
                input: message,
            });

            const parsed = JSON.parse(response.output_text)

            const content: ai_gen = {
                text: parsed.text,
                arrangements: parsed.arrangements,
                id: response.id
            }

            if (!content) {
                throw new Error('No response from OpenAI.');
            }

            return content;
        } catch (error) {
            console.error('Error during OpenAI chat:', error);
            throw new Error('Failed to communicate with OpenAI.');
        }
    }
}
