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
        Game: jest.fn().mockImplementation(() => {
            const board = { slots: {}, getHeight: jest.fn(), getWidth: jest.fn() };
            return {
                get getBoard() {
                    return board 
                }
            }
        })
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
        const setBoard = testGame.setBoard();
        
        expect(setBoard).toBe(true)
        expect(Board).toHaveBeenCalledTimes(1);
        expect(GenericSlot).toHaveBeenCalledTimes(9);
        expect(PlayableSlot).toHaveBeenCalledTimes(6);
    })

    test("fill influenced slots for a slot with valid neighbors", () => {
        const testArrangement = [
            [null, false, false],
            [null, true, false],
            [null, true, false],
        ];

        const initGame = new InitGame(3, 3, testArrangement);
        initGame.setBoard();

        Object.setPrototypeOf(initGame.game.getBoard.slots['2,1'], PlayableSlot.prototype)

        const mocked = jest.spyOn((initGame.game.getBoard.slots['2,1'] as PlayableSlot), 'setInfluencedSlots', 'set' )

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

        Object.setPrototypeOf(initGame.game.getBoard.slots['1,1'], PlayableSlot.prototype)

        const mocked = jest.spyOn((initGame.game.getBoard.slots['1,1'] as PlayableSlot), 'setInfluencedSlots', 'set' )

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

        Object.setPrototypeOf(initGame.game.getBoard.slots['0,0'], PlayableSlot.prototype)

        const mocked = jest.spyOn((initGame.game.getBoard.slots['0,0'] as PlayableSlot), 'setInfluencedSlots', 'set' )

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

        Object.setPrototypeOf(initGame.game.getBoard.slots['2,2'], PlayableSlot.prototype)

        const mocked = jest.spyOn((initGame.game.getBoard.slots['2,2'] as PlayableSlot), 'setInfluencedSlots', 'set' )

        const result = initGame.fillInfluencedSlots();

        expect(result).toBe(true)
        expect(mocked).toHaveBeenCalledTimes(1)
        expect(mocked).toHaveBeenCalledWith([[], [], [], []])
    });
})