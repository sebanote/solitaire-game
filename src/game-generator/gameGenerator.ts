import { OpenAIService } from './utils/openaiService';
import { ai_gen }  from './utils/types'

export class GameGenerator {
    private openAIService: OpenAIService;
    private previousId: string | null | undefined = null;

    constructor() {
        this.openAIService = new OpenAIService();
    }

    classicGameArrangement: Array<Array<null | boolean>> = [
        [null, null, true, true, true, null, null],
        [null, null, true, true, true, null, null],
        [true, true, true, true, true, true, true],
        [true, true, true, null, true, true, true],
        [true, true, true, true, true, true, true],
        [null, null, true, true, true, null, null],
        [null, null, true, true, true, null, null],
    ];

    async generateGame(language:string): Promise<ai_gen> {
        try {
            // Start a chat session with OpenAI for customization
                const greeting: string = `
                
                you are the assistant that will help creating the solitaire board for a new game. ${this.classicGameArrangement} is 
                the classic arrangement where null represents not playable slots, true are taken slots and false are available slots. 
                You must retrieve the arrangement based on what you are asked to do. You must never talk about something different than 
                this game.

                Your response must be an object:

                {
                    text: // any text response to be displayed on the chat window,
                    arrangements: // an array of arrangements (arrangement[]) to be used in the game
                }

                On this first interaction I need you just to translate this greeting message to ${language}: "Hello this is a classic 
                cross shaped 7x7 solitaire board, if you want anything different you can just ask. For example: I want 10 different levels 
                from easier to harder using the classic board but you can start with fewer pins"`
                
                const aIGreeting = await this.openAIService.chat(greeting, null);

                this.previousId = aIGreeting.id;

                // Parse the AI response to extract the new arrangement
                return aIGreeting;
            

        } catch (error) {
            console.error('Error generating game:', error);
            throw new Error('Failed to generate game.');
        }
    }

    async configGameThroughChat(message:string):Promise<ai_gen>{
        const aiResponse = await this.openAIService.chat(message, this.previousId);
        this.previousId = aiResponse.id;
        return aiResponse;
    }
}
