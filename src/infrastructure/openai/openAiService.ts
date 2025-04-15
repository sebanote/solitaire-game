/* global process */
import OpenAI from 'openai';
import 'dotenv/config'


export class OpenAiService {
  private openai: OpenAI;

  constructor() {
    const openAiKey  = process.env.OPENAI_API_KEY
    this.openai = new OpenAI({
      apiKey: openAiKey,
    });
  }

  async generateLevel(): Promise<(boolean | null)[][]> {
    const prompt = `Generate a valid solitaire game board arrangement. 
    The board should be 7x7 with null for empty spaces and true/false for pins/holes.
    Response should be valid JSON array.
    Rules:
    - Board must be symmetrical
    - Center should typically be false (empty)
    - Corners should be null
    - Response should only contain the array, no explanations`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Failed to generate level");
    
    return JSON.parse(content);
  }
}
