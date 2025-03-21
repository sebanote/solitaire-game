import { Board } from "../../../../src/domain/entities/board";


describe('Board class', () => {


    test('Create a new Board with 32 slots', () => {
        const testBoard = new Board(32);

        expect(testBoard.slots.length).toEqual(32);
    })
})