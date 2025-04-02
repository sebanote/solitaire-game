import { InitGame } from '../../../../../src/domain/use-cases/init-game'
import { Board } from '../../../../../src/domain/entities/board';
import { GenericSlot } from '../../../../../src/domain/entities/slot';
import { PlayableSlot } from '../../../../../src/domain/entities/decorators/playableSlotDecorator';



jest.mock('../../../../../src/domain/entities/board', () => {
    return {
        Board: jest.fn().mockImplementation((x,y) => {
            return {
                getHeight: x,
                getWidth: y,
                slots: {}
            }
        })
    }
})
jest.mock("../../../../../src/domain/entities/slot", () => {
    return {
        GenericSlot: jest.fn().mockImplementation()
    };
});
jest.mock("../../../../../src/domain/entities/decorators/playableSlotDecorator", () => {
    return {
        PlayableSlot: jest.fn().mockImplementation()
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("InitGame class", () => {
    test("create new game", () => {

        const testArrangement = [
            [null,true,false],
            [null,true,false],
            [null,true,false],
        ]

        const testGame = new InitGame(3,3,testArrangement);

        expect(testGame).toBeInstanceOf(InitGame);
    })
    test("create new game with 0 slots", () => {

        const testArrangement: boolean[][] = [[]]

        const testGame = new InitGame(0,0,testArrangement);

        testGame.setBoard()

        expect(testGame).toBeInstanceOf(InitGame);
    })
    test("Set a new board for a game", () => {

        const testArrangement = [
            [null,true,false],
            [null,true,false],
            [null,true,false],
        ]

        const testGame = new InitGame(3,3,testArrangement);

        testGame.setBoard();

        expect(Board).toHaveBeenCalledTimes(1);
        expect(GenericSlot).toHaveBeenCalledTimes(9);
        expect(PlayableSlot).toHaveBeenCalledTimes(6);
        expect(testGame.getBoard().slots['0,0']).toBeInstanceOf(GenericSlot);
        expect(testGame.getBoard().slots['2,2']).toBeInstanceOf(PlayableSlot);
    })
    test("Get number of pins", () => {

        const testArrangement = [
            [null,true,false],
            [null,true,false],
            [null,true,false],
        ]

        const testGame = new InitGame(3,3, testArrangement)
        testGame.setBoard();
        const pins = testGame.getPins();

        expect(pins).toEqual(3);

    })
    test("Get number of pins if 0 pins", () => {

        const testArrangement = [
            [null,null,false],
            [null,false,false],
            [null,false,false],
        ]

        const testGame = new InitGame(3,3, testArrangement)
        
        const pins = testGame.getPins();

        expect(pins).toEqual(0);
    })
    
    test("set pins to 10", () => {

        const testArrangement = [
            [null,true,false],
            [null,true,false],
            [null,true,false],
        ]

        const testGame = new InitGame(3,3, testArrangement)
        testGame.setPins(10);

        expect(testGame.getPins()).toEqual(10);
    })

    test("set pins to 0", () => {

        const testArrangement = [
            [null,true,false],
            [null,true,false],
            [null,true,false],
        ]

        const testGame = new InitGame(3,3, testArrangement)
        testGame.setPins(0);

        expect(testGame.getPins()).toEqual(0);
    })

    test("setBoard returns false and logs error on exception", () => {
        const testArrangement = [
            [null, true, false],
            [null, true, false],
            [null, true, false],
        ];

        const testGame = new InitGame(3, 3, testArrangement);

        jest.spyOn(console, "error").mockImplementation(() => {});

        // Simulate an error by mocking the board to throw an exception
        (testGame as any).board = null;

        const result = testGame.setBoard();

        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalledTimes(1);

        (console.error as jest.Mock).mockRestore();
    });

    // test("Remove a pin", () => {

    //     const testGame = new Game(3,3,[
    //         null,null,false,
    //         false,null,null,
    //         true,true,true
    //     ])

    //     const pins = testGame.pins;

    //     testGame.removePin();

    //     expect(testGame.pins).toEqual(pins - 1)

    // })
    // test("Finish a game when there's only one pin", () => {

    //     const testGame = new Game(3,3,[
    //         null,null,false,
    //         false,null,null,
    //         true,false,false
    //     ])

    //     expect(testGame.finished()).toEqual(true)
    // })
    // test("Finish a game when more than one pin but not possible moves", () => {

    //     const testGame = new Game(3,3,[
    //         null,null,true,
    //         false,null,null,
    //         true,false,false
    //     ])

    //     expect(testGame.finished()).toEqual(true)
    // })
})