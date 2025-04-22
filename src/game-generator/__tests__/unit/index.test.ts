import request from 'supertest';
import app from '../../index';
import { Server } from 'http';

jest.mock('../../gameGenerator', () => {
    return {
      GameGenerator: jest.fn().mockImplementation(() => ({
        generateGame: jest.fn().mockResolvedValue({id:1, text:'Ai response', arrangements: [[true,false,true]]}),
        configGameThroughChat: jest.fn((message) => {
            if(message){
                return 'AI response'
            }
            else{
                return new Error('Chat service error')
            }
        }),
      }))
    };
  });

afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
});
let server: Server;

afterAll(async () => {
    jest.restoreAllMocks(); // Restore all mocks after all tests
    if (server && server.close) {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve(null)));
        });
    }
});

// Mock server initialization
beforeAll(() => {
    server = app.listen(); // Start the server and store the instance
});

describe('Game Generator API', () => {
    describe('POST /generate-game', () => {
        test('should generate a default game and return 200 status', async () => {

            const response = await request(app)
                .post('/generate-game')
                .send({language:'es'})

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('defaultGame');
        });

        test('should return 500 status if an error occurs', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error in test

            const response = await request(app)
                .post('/generate-game')
                .send({}); // Sending invalid data to trigger an error

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Failed to generate game.');
        });
    });

    describe('POST /chat', () => {
        test('should return AI response and 200 status', async () => {

            const mockMessage = { message: 'Hello AI' };
            const response = await request(app)
                .post('/chat')
                .send(mockMessage);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('response', 'AI response');
        });
    });
});