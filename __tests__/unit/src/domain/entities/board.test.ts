import { describe, expect, test } from '@jest/globals';
import { Board } from "../../../../../src/domain/entities/board";

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Board class', () => {

    test('Create a new Board of width 10, height 10', () => {
        const testBoard = new Board(10,10);

        expect(testBoard.getWidth).toEqual(10);
        expect(testBoard.getHeight).toEqual(10);
    });
    test('Create a new Board of width 1, height 1', () => {
        const testBoard = new Board(1,1);

        expect(testBoard.getWidth).toEqual(1);
        expect(testBoard.getHeight).toEqual(1);
    });
    test('Create a new Board of width 1000, height 1000', () => {
        const testBoard = new Board(1000,1000);

        expect(testBoard.getWidth).toEqual(1000);
        expect(testBoard.getHeight).toEqual(1000);
    });
    test('create a board with 0 slots', () => {

        const testBoard = () => new Board(0,0)

        expect(Board).toThrow();
        expect(Board).toThrow(Error);
        expect(testBoard).toThrow("Not acceptable value for board size"); ;
    })
})