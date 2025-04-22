import { OpenAIService } from '../../../utils/openaiService';
import OpenAI from 'openai';
import { jest } from '@jest/globals';

jest.mock('openai');

describe('OpenAIService', () => {
    let openAIService: OpenAIService;
    let mockCreateResponse: jest.MockedFunction<() => Promise<{ output_text: string; previous_response_id: string }>>;

    beforeEach(() => {
        mockCreateResponse = jest.fn();
        (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
            responses: {
                create: mockCreateResponse,
            },
        }));
        openAIService = new OpenAIService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return parsed content when OpenAI responds successfully', async () => {
        const mockResponse = {
            output_text: JSON.stringify({
                text: 'Generated text',
                arrangements: ['arrangement1', 'arrangement2'],
            }),
            previous_response_id: 'response-id-123',
        };

        mockCreateResponse.mockResolvedValue(mockResponse as { output_text: string; previous_response_id: string });

        const result = await openAIService.chat('Test message', null);

        expect(mockCreateResponse).toHaveBeenCalledWith({
            model: 'gpt-4.1',
            previous_response_id: null,
            input: 'Test message',
        });

        expect(result).toEqual({
            text: 'Generated text',
            arrangements: ['arrangement1', 'arrangement2'],
            id: 'response-id-123',
        });
    });

    it('should throw an error if OpenAI response is invalid', async () => {
        const mockResponse = {
            output_text: 'Invalid JSON',
            previous_response_id: 'response-id-123',
        };

        mockCreateResponse.mockResolvedValue(mockResponse);

        await expect(openAIService.chat('Test message', null)).rejects.toThrow(
            'Failed to communicate with OpenAI.'
        );

        expect(mockCreateResponse).toHaveBeenCalledWith({
            model: 'gpt-4.1',
            previous_response_id: null,
            input: 'Test message',
        });
    });

    it('should throw an error if OpenAI does not return a response', async () => {
        mockCreateResponse.mockResolvedValue({ output_text: '', previous_response_id: '' });

        await expect(openAIService.chat('Test message', null)).rejects.toThrow(
            'Failed to communicate with OpenAI.'
        );

        expect(mockCreateResponse).toHaveBeenCalledWith({
            model: 'gpt-4.1',
            previous_response_id: null,
            input: 'Test message',
        });
    });

    it('should log an error and throw if OpenAI throws an exception', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockCreateResponse.mockRejectedValue(new Error('OpenAI error'));

        await expect(openAIService.chat('Test message', null)).rejects.toThrow(
            'Failed to communicate with OpenAI.'
        );

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error during OpenAI chat:',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });
});