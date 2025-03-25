import { Board } from "../../../../src/domain/entities/board";
import { Slots, PlayableSlot } from "../../../../src/domain/entities/slots";

jest.mock("../../../../src/domain/entities/slots", () => {
    return {
        Slots: jest.fn().mockImplementation((x,y) => {
        return {}
      }),
        PlayableSlot: jest.fn().mockImplementation((x, y, status) => {
        return {}
      })
    };
  });

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Board class', () => {

    test('Create a new Board with 81 slots', () => {
        const testBoard = new Board(9,9);

        expect(testBoard.slots.length).toEqual(81);
        expect(Slots).toHaveBeenCalledTimes(81);
    });
    test('Create a new Board with 9 slots, 3 of them should be playable', () => {
        const testBoard = new Board(3,3,[null, null, null, true, false, true, null, null, null]);

        console.log(testBoard)

        expect(Slots).toHaveBeenCalledTimes(9);
        expect(PlayableSlot).toHaveBeenCalledTimes(3);
        expect(testBoard.slots.length).toEqual(9);
    });
    test('Create a new board with just one slot that is playable', () => {

        const testBoard = new Board(1,1, [true]);

        expect(PlayableSlot).toHaveBeenCalledTimes(1);
        expect(Slots).toHaveBeenCalledTimes(1);

    });
    test('Create a new board with just one slot that is not playable', () => {

        const testBoard = new Board(1,1);

        expect(PlayableSlot).not.toHaveBeenCalledTimes(1);
        expect(Slots).toHaveBeenCalledTimes(1);

    });
})