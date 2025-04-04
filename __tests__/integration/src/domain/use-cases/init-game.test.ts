import { InitGame } from '../../../../../src/domain/use-cases/init-game'
import { Board } from '../../../../../src/domain/entities/board';
import { GenericSlot } from '../../../../../src/domain/entities/slot';
import { PlayableSlot } from '../../../../../src/domain/entities/decorators/playableSlotDecorator';
import { Game } from '../../../../../src/domain/entities/game'

describe("InitGame class", () => {
    test("create new game", () => {

        const testArrangement = [
            [null,true,false],
            [null,true,false],
            [null,true,false],
        ]

        const testGame = new InitGame(3,3,testArrangement);

        expect(testGame).toBeInstanceOf(InitGame);
        expect(testGame.getBoard().getHeight).toBe(3)
    })
    test("create new game with 0 slots", () => {

        const testArrangement: boolean[][] = [[]]

        expect(() => {
            new InitGame(0,0,testArrangement);
          }).toThrow('Not acceptable value for board size');
    })
    test("Set a new board for a game", () => {

        const testArrangement = [
            [null,true,false],
            [null,true,false],
            [null,true,false],
        ]

        const testGame = new InitGame(3,3,testArrangement);

        testGame.setBoard();

        expect((testGame.getBoard().slots['2,2'] as PlayableSlot).isTaken()).toBe(false);
        expect((testGame.getBoard().slots['2,1'] as PlayableSlot).isTaken()).toBe(true);
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

        console.log((initGame.getBoard().slots["2,1"] as PlayableSlot).getInfluencedSlots.aim)

        expect(result).toBe(true)
        expect(mocked).toHaveBeenCalledTimes(1)
        expect(mocked).toHaveBeenCalledWith({"aim": ["0,1"], "next": ["2,2","1,1"]})
        expect((initGame.getBoard().slots["2,1"] as PlayableSlot).getInfluencedSlots.aim).toStrictEqual(["0,1"])
        expect((initGame.getBoard().slots["2,1"] as PlayableSlot).getInfluencedSlots.next).toStrictEqual(["2,2","1,1"])
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
        expect(mocked).toHaveBeenCalledWith({"aim": [], "next": []})
        expect((initGame.getBoard().slots["1,1"] as PlayableSlot).getInfluencedSlots.aim).toStrictEqual([])
        expect((initGame.getBoard().slots["1,1"] as PlayableSlot).getInfluencedSlots.next).toStrictEqual([])
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
        expect(mocked).toHaveBeenCalledWith({"aim": ["2,0","2,4","0,2","4,2"], "next": ["2,1","2,3","1,2","3,2"]})
        expect((initGame.getBoard().slots["2,2"] as PlayableSlot).getInfluencedSlots.aim).toStrictEqual(["2,0","2,4","0,2","4,2"])
        expect((initGame.getBoard().slots["2,2"] as PlayableSlot).getInfluencedSlots.next).toStrictEqual(["2,1","2,3","1,2","3,2"])
    });
})