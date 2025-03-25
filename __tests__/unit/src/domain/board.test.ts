import { describe, expect, test } from '@jest/globals';
import { PlayableSlot } from "../../../../src/domain/decorators/playableSlotDecorator";
import { Board } from "../../../../src/domain/entities/board";
import { GenericSlot } from "../../../../src/domain/entities/slot";


jest.mock("../../../../src/domain/entities/slot", () => {
    return {
        GenericSlot: jest.fn().mockImplementation((x,y) => {
            return {position_x: x, position_y: y}
      })
    };
  });

jest.mock("../../../../src/domain/decorators/playableSlotDecorator", () => {
    return {
        PlayableSlot: jest.fn().mockImplementation((slot) => {
            return {
                position_x: slot.position_x,
                position_y: slot.position_y,
                setTaken: jest.fn().mockReturnValue(slot),
            }
        })
    }
})

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Board class', () => {

    test('Create a new Board with 81 slots', () => {
        const testBoard = new Board(9,9);

        expect(testBoard.slots.length).toEqual(81);
        expect(GenericSlot).toHaveBeenCalledTimes(81);
    });
    test('Create a new Board with 9 slots, 3 of them should be playable', () => {
        const testBoard = new Board(3,3,[null, null, null, true, false, true, null, null, null]);

        expect(GenericSlot).toHaveBeenCalledTimes(9);
        expect(PlayableSlot).toHaveBeenCalledTimes(3);
        expect(testBoard.slots.length).toEqual(9);
    });
    test('Create a new board with just one slot that is playable and is not taken', () => {

        const testBoard = new Board(1,1, [false]);

        expect(GenericSlot).toHaveBeenCalledTimes(1);
        expect(PlayableSlot).toHaveBeenCalledTimes(1);
        expect((testBoard.slots[0] as PlayableSlot).setTaken).toHaveBeenCalledWith(false);

    });
    test('Create a new board with just one slot that is playable and taken', () => {

        const testBoard = new Board(1,1, [true]);

        expect(GenericSlot).toHaveBeenCalledTimes(1);
        expect(PlayableSlot).toHaveBeenCalledTimes(1);
        expect((testBoard.slots[0] as PlayableSlot).setTaken).toHaveBeenCalledWith(true);

    });
    test('Create a new board with just one slot that is not playable', () => {

        const testBoard = new Board(1,1);

        expect(PlayableSlot).toHaveBeenCalledTimes(0);
        expect(GenericSlot).toHaveBeenCalledTimes(1);

    });
})