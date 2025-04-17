import { OpenAiService } from '../../../../../src/infrastructure/openai/openAiService';
import OpenAI from 'openai';

jest.mock('openai');

describe('OpenAiService', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeAll(() => {
        originalEnv = { ...process.env };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should initialize OpenAI with the API key from environment variables', () => {
        const mockApiKey = 'test-api-key';
        process.env.OPENAI_API_KEY = mockApiKey;

        const openAiService = new OpenAiService();

        expect(OpenAI).toHaveBeenCalledWith({ apiKey: mockApiKey });
    });

    it('should throw an error if OPENAI_API_KEY is not set', () => {
        delete process.env.OPENAI_API_KEY;

        expect(() => new OpenAiService()).toThrow('An error')
    });
});