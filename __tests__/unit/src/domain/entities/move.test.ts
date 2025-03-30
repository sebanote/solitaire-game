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
    test("Default values are set correctly when no arguments are provided", () => {
        const defaultMove = new Move();
    
        expect(defaultMove.movingFrom).toBe('0,0');
        expect(defaultMove.movingTo).toBe('0,0');
    });
    
    test("Throws an error when movingFrom is empty", () => {
        expect(() => new Move("", "5,5")).toThrow("Invalid move positions");
    });
    
    test("Throws an error when movingTo is empty", () => {
        expect(() => new Move("0,0", "")).toThrow("Invalid move positions");
    });
    
    test("Allows valid positions for movingFrom and movingTo", () => {
        const validMove = new Move("1,1", "2,2");
    
        expect(validMove.movingFrom).toBe("1,1");
        expect(validMove.movingTo).toBe("2,2");
    });
    
    test("Handles positions with different formats", () => {
        const formattedMove = new Move("A1", "B2");
    
        expect(formattedMove.movingFrom).toBe("A1");
        expect(formattedMove.movingTo).toBe("B2");
    });
})