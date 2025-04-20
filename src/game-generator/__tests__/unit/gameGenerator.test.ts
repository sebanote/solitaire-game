import { GameGenerator } from '../../gameGenerator';
import { OpenAIService } from '../../utils/openaiService';
import { ai_gen } from '../../utils/types';

jest.mock('../../utils/openaiService');

describe('GameGenerator', () => {
    let gameGenerator: GameGenerator;
    let mockOpenAIService: jest.Mocked<OpenAIService>;

    beforeEach(() => {
        mockOpenAIService = new OpenAIService() as jest.Mocked<OpenAIService>;
        (OpenAIService as jest.Mock).mockImplementation(() => mockOpenAIService);
        gameGenerator = new GameGenerator();
    });

    describe('generateGame', () => {
        it('should call OpenAIService.chat with the correct greeting message and return the AI response', async () => {
            const mockResponse: ai_gen = {
                id: '123',
                text: 'Translated greeting message',
                arrangements: [[[true, false, null]]],
            };
            mockOpenAIService.chat.mockResolvedValue(mockResponse);

            const language = 'es';
            const result = await gameGenerator.generateGame(language);

            expect(mockOpenAIService.chat).toHaveBeenCalledWith(expect.stringContaining('you are the assistant'), null);
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error if OpenAIService.chat fails', async () => {
            mockOpenAIService.chat.mockRejectedValue(new Error('Chat service error'));

            await expect(gameGenerator.generateGame('en')).rejects.toThrow('Failed to generate game');
        });
    });

    describe('configGameThroughChat', () => {
        it('should call OpenAIService.chat with the correct message and previousId, and return the AI response', async () => {
            const mockResponse: ai_gen = {
                id: '456',
                text: 'Response to user message',
                arrangements: [[[false, true, null]]],
            };
            mockOpenAIService.chat.mockResolvedValue(mockResponse);

            const message = 'Create a harder level';
            const result = await gameGenerator.configGameThroughChat(message);

            expect(mockOpenAIService.chat).toHaveBeenCalledWith(message, null);
            expect(result).toEqual(mockResponse);
        });

        it('should update previousId after receiving a response', async () => {
            const mockResponse: ai_gen = {
                id: '789',
                text: 'Another response',
                arrangements: [[[true, true, false]]],
            };
            mockOpenAIService.chat.mockResolvedValue(mockResponse);

            await gameGenerator.configGameThroughChat('Another message');
            expect(gameGenerator['previousId']).toBe('789');
        });

        it('should throw an error if OpenAIService.chat fails', async () => {
            mockOpenAIService.chat.mockRejectedValue(new Error('Chat service error'));

            await expect(gameGenerator.configGameThroughChat('Test message')).rejects.toThrow('Chat service error');
        });
    });
});