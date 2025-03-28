import { Move } from '../../../../../src/domain/entities/move'

describe("Move class", () => {
    test("Create new move", () => {

        const testMove = new Move('0,0','5,5')

        expect(testMove).toBeInstanceOf(Move);
        expect(testMove.movingFrom).toBe('0,0');
        expect(testMove.movingTo).toBe('5,5')
    })
    test("Throws an error when no positions are provided", () => {
        expect(() => new Move("", "")).toThrow("Invalid move positions");
    });
})