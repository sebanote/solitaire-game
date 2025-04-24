import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatWindowProps {
  initialMessage: string;
  onGameBoardUpdate?: (arrangements: Array<Array<boolean | null>>) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ initialMessage, onGameBoardUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Set initial message when component mounts
    setMessages([{
      text: initialMessage,
      isUser: false,
      timestamp: new Date(),
    }]);
  }, [initialMessage]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputText;
    setInputText('');

    try {
      console.log('Sending message to AI:', currentMessage);
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received AI response:', data.response);

      if (!data.response) {
        throw new Error('Invalid response format');
      }

      // Handle game board update first if arrangements are present
      if (data.response.arrangements && onGameBoardUpdate) {
        onGameBoardUpdate(data.response.arrangements);
      }

      // Add only the text response to chat history
      const aiMessage: Message = {
        text: data.response.text,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        text: 'Sorry, there was an error sending your message.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[400px] border border-gray-300 rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white ${
              isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};
