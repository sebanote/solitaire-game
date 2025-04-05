import { InitGame } from '../../../../../src/domain/use-cases/init-game'
import { Board } from '../../../../../src/domain/entities/board';
import { GenericSlot } from '../../../../../src/domain/entities/slot';
import { PlayableSlot } from '../../../../../src/domain/entities/decorators/playableSlotDecorator';
import { Game } from '../../../../../src/domain/entities/game'



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
jest.mock('../../../../../src/domain/entities/game', () => {
    return {
        Game: jest.fn().mockImplementation()
    }
})
jest.mock("../../../../../src/domain/entities/slot", () => {
    return {
        GenericSlot: jest.fn().mockImplementation(() => {
            return {
                position_x: 1,
                position_y: 2
            }
        })
    };
});
jest.mock("../../../../../src/domain/entities/decorators/playableSlotDecorator", () => {
    const originalModule = jest.requireActual("../../../../../src/domain/entities/decorators/playableSlotDecorator");
    return {
        PlayableSlot: jest.fn().mockImplementation(() => {
            return {
                position_x: 1,
                position_y: 2,
                isTaken: jest.fn().mockReturnValue(true),
                set setInfluencedSlots (influenced: Array<string[]>){
                    this.influencedSlots = influenced
                }
            }
        })
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
        expect(Board).toHaveBeenCalledTimes(1);
        expect(Board).toHaveBeenCalledWith(3,3);
        expect(Game).toHaveBeenCalledTimes(1);
    })
    test("create new game with 0 slots", () => {

        const testArrangement: boolean[][] = [[]]

        const testGame = new InitGame(0,0,testArrangement);

        testGame.setBoard()

        expect(testGame).toBeInstanceOf(InitGame);
        expect(Board).toHaveBeenCalledTimes(1);
        expect(Board).toHaveBeenCalledWith(0,0);
        expect(Game).toHaveBeenCalledTimes(1);
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
        expect((testGame.getBoard().slots['2,2'] as PlayableSlot).isTaken).toBeDefined();
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

    test("fill influenced slots for a slot with valid neighbors", () => {
        const testArrangement = [
            [null, false, false],
            [null, true, false],
            [null, true, false],
        ];

        const initGame = new InitGame(3, 3, testArrangement);
        initGame.setBoard();

        const mocked = jest.spyOn((initGame.getBoard().slots['2,1'] as PlayableSlot), 'setInfluencedSlots', 'set' )

        const result = initGame.fillInfluencedSlots();

        expect(result).toBe(true)
        expect(mocked).toHaveBeenCalledTimes(1)
        expect(mocked).toHaveBeenCalledWith([[], [], [], []])
    });

    test("fill influenced slots for a slot surrounded by generic slots", () => {
        const testArrangement = [
            [null, null, null],
            [null, true, null],
            [null, null, null],
        ];

        const initGame = new InitGame(3, 3, testArrangement);
        initGame.setBoard();
        const mocked = jest.spyOn((initGame.getBoard().slots['1,1'] as PlayableSlot), 'setInfluencedSlots', 'set' )

        const result = initGame.fillInfluencedSlots();

        expect(result).toBe(true)
        expect(mocked).toHaveBeenCalledTimes(1)
        expect(mocked).toHaveBeenCalledWith([[], [], [], []])
    });

    test("fill influenced slots for a single slot board", () => {
        const testArrangement = [
            [true]
        ];

        const initGame = new InitGame(1, 1, testArrangement);
        initGame.setBoard();
        const mocked = jest.spyOn((initGame.getBoard().slots['0,0'] as PlayableSlot), 'setInfluencedSlots', 'set' )

        const result = initGame.fillInfluencedSlots();

        expect(result).toBe(true)
        expect(mocked).toHaveBeenCalledTimes(1)
        expect(mocked).toHaveBeenCalledWith([[], [], [], []])
    });

    test("fill influenced slots for a slot with multiple neighbors", () => {
        const testArrangement = [
            [true, true, true, true, true],
            [true, true, true, true, true],
            [true, true, true, true, true],
            [true, true, true, true, true],
            [true, true, true, true, true],
        ];

        const initGame = new InitGame(5, 5, testArrangement);
        initGame.setBoard();

        const mocked = jest.spyOn((initGame.getBoard().slots['2,2'] as PlayableSlot), 'setInfluencedSlots', 'set' )

        const result = initGame.fillInfluencedSlots();

        expect(result).toBe(true)
        expect(mocked).toHaveBeenCalledTimes(1)
        expect(mocked).toHaveBeenCalledWith([[], [], [], []])
    });
})