import { Game } from '../../../../../src/domain/entities/game';
import { Board } from '../../../../../src/domain/entities/board';
import { Move } from '../../../../../src/domain/entities/move';

jest.mock('../../../../../src/domain/entities/board', () => {
    return {
        Board: jest.fn().mockImplementation((x,y) => {
            return {
                getWidth: jest.fn().mockReturnValue(x),
                getHeight: jest.fn().mockReturnValue(y),
                slots: {
                    '0,0': new Move(),
                    '0,1': new Move(),
                    '0,2': new Move(),
                    '1,0': new Move(),
                    '1,1': new Move(),
                    '1,2': new Move(),
                    '2,0': new Move(),
                    '2,1': new Move(),
                    '2,2': new Move(),
                },
            }
        })
    };
})
jest.mock('../../../../../src/domain/entities/move', () => {
    return {
        Move: jest.fn().mockImplementation((from,to) => {
            return {
                movingFrom: from,
                movingTo: to,
            }
        }),
    }      
});

jest.mock('../../../../../src/domain/entities/move', () => {
    return {
        Move: jest.fn().mockImplementation((from,to) => ({
            movingFrom: from,
            movingTo: to,
        })),
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Game class', () => {

    test('should initialize with the provided board', () => {

        const board = new Board(10, 10);
        const game = new Game(board);

        expect(game.getBoard).toBe(board);
    });

    test('should initialize with zero pins', () => {
        const board = new Board(10, 10);
        const game = new Game(board);

        expect(game.getPins).toBe(0);
    });

    test('should allow setting the number of pins', () => {
        const board = new Board(10, 10);
        const game = new Game(board);

        game.setPins = 5;
        expect(game.getPins).toBe(5);
    });

    test('should initialize with an empty moves array', () => {
        const board = new Board(10, 10);
        const game = new Game(board);

        expect(game.getMoves).toEqual([]);
    });

    test('should add a move to the moves array', () => {
        const board = new Board(10, 10);
        const game = new Game(board);

        const move = new Move('0,0','0,2');
        game.addMove(move);
        expect(game.getMoves).toContain(move);
    });

    it('should remove the last move when rolling back', () => {
        const board = new Board(10, 10);
        const game = new Game(board);
        const move1 = new Move();
        const move2 = new Move();
        game.addMove(move1);
        game.addMove(move2);

        game.rollBackMove();

        expect(game.getMoves).toEqual([move1]);
    });

    it('should do nothing when rolling back with no moves', () => {
        const board = new Board(10, 10);
        const game = new Game(board);
        game.rollBackMove();
        expect(game.getMoves).toEqual([]);
    });
});
