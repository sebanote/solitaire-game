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
        test('should call OpenAIService.chat with the correct greeting message and return the AI response', async () => {
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

        test('should throw an error if OpenAIService.chat fails', async () => {
            mockOpenAIService.chat.mockRejectedValue(new Error('Chat service error'));

            await expect(gameGenerator.generateGame('en')).rejects.toThrow('Failed to generate game');
        });
    });

    describe('configGameThroughChat', () => {
        test('should call OpenAIService.chat with the correct message and previousId, and return the AI response', async () => {
            const mockResponse: ai_gen = {
                id: '456',
                text: 'Response to user message',
                arrangements: [[[false, true, null]]],
            };
            mockOpenAIService.chat.mockResolvedValue(mockResponse);

            const result = await gameGenerator.configGameThroughChat('Create a harder level');

            expect(mockOpenAIService.chat).toHaveBeenCalledWith('Create a harder level', null);
            expect(result).toEqual(mockResponse);

            await gameGenerator.configGameThroughChat('Create an even harder level');
            expect(mockOpenAIService.chat).toHaveBeenCalledWith('Create an even harder level', '456');
        });

        test('should update previousId after receiving a response', async () => {
            const mockResponse: ai_gen = {
                id: '789',
                text: 'Another response',
                arrangements: [[[true, true, false]]],
            };
            mockOpenAIService.chat.mockResolvedValue(mockResponse);

            await gameGenerator.configGameThroughChat('Another message');
            expect(mockOpenAIService.chat).toHaveBeenCalledWith('Another message', null);
            expect(gameGenerator['previousId']).toBe('789');
        });

        test('should throw an error if OpenAIService.chat fails', async () => {
            mockOpenAIService.chat.mockRejectedValue(new Error('Chat service error'));

            await expect(gameGenerator.configGameThroughChat('Test message')).rejects.toThrow('Chat service error');
        });
    });
});