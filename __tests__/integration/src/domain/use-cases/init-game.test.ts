import { InitGame } from '../../../../../src/domain/use-cases/init-game'
import { PlayableSlot } from '../../../../../src/domain/entities/decorators/playableSlotDecorator';

describe("InitGame class", () => {
    test("create new game", () => {

        const testArrangement = [
            [null,true,false],
            [null,true,false],
            [null,true,false],
        ]

        const testGame = new InitGame(3,3,testArrangement);

        expect(testGame).toBeInstanceOf(InitGame);
        expect(testGame.game.getBoard.getHeight).toBe(3)
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

        expect((testGame.game.getBoard.slots['2,2'] as PlayableSlot).isTaken()).toBe(false);
        expect((testGame.game.getBoard.slots['2,1'] as PlayableSlot).isTaken()).toBe(true);
    })
    test("fill influenced slots for a slot with valid neighbors", () => {
        const testArrangement = [
            [null, false, false],
            [null, true, false],
            [null, true, false],
        ];

        const initGame = new InitGame(3, 3, testArrangement);
        initGame.setBoard();

        const mocked = jest.spyOn((initGame.game.getBoard.slots['2,1'] as PlayableSlot), 'setInfluencedSlots', 'set' )

        const result = initGame.fillInfluencedSlots();

        expect(result).toBe(true)
        expect(mocked).toHaveBeenCalledTimes(1)
        expect(mocked).toHaveBeenCalledWith([[], ["2,2"], ["1,1", "0,1"], []])
        expect((initGame.game.getBoard.slots["2,1"] as PlayableSlot).getInfluencedSlots).toStrictEqual([[], ["2,2"], ["1,1", "0,1"], []])
    });

    test("fill influenced slots for a slot surrounded by generic slots", () => {
        const testArrangement = [
            [null, null, null],
            [null, true, null],
            [null, null, null],
        ];

        const initGame = new InitGame(3, 3, testArrangement);
        initGame.setBoard();
        const mocked = jest.spyOn((initGame.game.getBoard.slots['1,1'] as PlayableSlot), 'setInfluencedSlots', 'set' )

        const result = initGame.fillInfluencedSlots();

        expect(result).toBe(true)
        expect(mocked).toHaveBeenCalledTimes(1)
        expect(mocked).toHaveBeenCalledWith([[], [], [], []])
        expect((initGame.game.getBoard.slots["1,1"] as PlayableSlot).getInfluencedSlots).toStrictEqual([[], [], [], []])
    });

    test("fill influenced slots for a slot with multiple neighbors", () => {
        const testArrangement = [
            [true, true, true, true, true],
            [true, true, true, true, true],
            [true, true, true, true, true],
            [true, true, true, true, true],
            [true, true, null, true, true],
        ];

        const initGame = new InitGame(5, 5, testArrangement);
        initGame.setBoard();

        const mocked = jest.spyOn((initGame.game.getBoard.slots['2,2'] as PlayableSlot), 'setInfluencedSlots', 'set' )

        const result = initGame.fillInfluencedSlots();

        expect(result).toBe(true)
        expect(mocked).toHaveBeenCalledTimes(1)
        expect(mocked).toHaveBeenCalledWith([["2,1", "2,0"], ["2,3", "2,4"], ["1,2", "0,2"], ["3,2"]])
        expect((initGame.game.getBoard.slots["2,2"] as PlayableSlot).getInfluencedSlots).toStrictEqual([["2,1", "2,0"], ["2,3", "2,4"], ["1,2", "0,2"], ["3,2"]])
    });
})