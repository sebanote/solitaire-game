import { Board } from "../../../../src/domain/entities/board";
import { notPlayableSlot, PlayableSlot } from "../../../../src/domain/entities/slots";

jest.mock("../../../../src/domain/entities/slots", () => {
    return {
        notPlayableSlot: jest.fn().mockImplementation(() => {
        return {
        }
      }),
        PlayableSlot: jest.fn().mockImplementation(() => {
        return {
        }
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
    })
    test('Create a new Board with 9 slots, 3 of them should be playable', () => {
        const testBoard = new Board(3,3,[null, null, null, true, false, true, null, null, null]);

        console.log(testBoard)

        expect(notPlayableSlot).toHaveBeenCalledTimes(9);
        expect(PlayableSlot).toHaveBeenCalledTimes(3);
        //expect(testBoard.slots[5].position_y).toEqual(1);
        //expect(testBoard.slots[3]).toBeInstanceOf(PlayableSlot);
        //expect(testBoard.slots[3].isEmptyStatus()).toBeFalsy();
    })
})