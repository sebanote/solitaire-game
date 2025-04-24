import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatWindow, ChatWindowProps } from '../../../src/components/ChatWindow';
import '@testing-library/jest-dom';

describe('ChatWindow Component', () => {
    const mockFetch = jest.fn();

    beforeEach(() => {
        globalThis.fetch = mockFetch;
    });

    

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (props: Partial<ChatWindowProps> = {}) => {
        const defaultProps: ChatWindowProps = {
            initialMessage: 'Hello! How can I assist you today?',
        };
        return render(<ChatWindow {...defaultProps} {...props} />);
    };

    test('renders initial message', async () => {
        renderComponent();
        expect(screen.getByText('Hello! How can I assist you today?')).toBeInTheDocument();
       
    });

    test('allows the user to type and send a message', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json:  () => ({ response: { text: 'AI response' } }),
        });

        renderComponent();

        const input = screen.getByPlaceholderText('Type your message...');
        const sendButton = screen.getByText('Send');

        fireEvent.change(input, { target: { value: 'Hello AI' } });
        fireEvent.click(sendButton);

        expect(screen.getByText('Hello AI')).toBeInTheDocument();
        expect(mockFetch).toHaveBeenCalledWith('/api/ai-chat', expect.anything());

        await waitFor(() => {
            expect(screen.getByText('AI response')).toBeInTheDocument();
        });
    });

    test('displays an error message if the API call fails', async () => {
        mockFetch.mockRejectedValueOnce(new Error('API error'));

        renderComponent();

        const input = screen.getByPlaceholderText('Type your message...');
        const sendButton = screen.getByText('Send');

        fireEvent.change(input, { target: { value: 'Hello AI' } });
        fireEvent.click(sendButton);

        expect(screen.getByText('Hello AI')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Sorry, there was an error sending your message.')).toBeInTheDocument();
        });
    });

    test('disables input and button while sending a message', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ response: { text: 'AI response' } }),
        });

        renderComponent();

        const input = screen.getByPlaceholderText('Type your message...');
        const sendButton = screen.getByText('Send');

        fireEvent.change(input, { target: { value: 'Hello AI' } });
        fireEvent.click(sendButton);

        expect(input).toBeDisabled();
        expect(sendButton).toBeDisabled();

        await waitFor(() => {
            expect(input).not.toBeDisabled();
            expect(sendButton).not.toBeDisabled();
        });
    });
});