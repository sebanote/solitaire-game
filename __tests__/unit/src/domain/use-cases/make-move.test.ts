import { Board } from '../../../../../src/domain/entities/board';
import { PlayableSlot } from '../../../../../src/domain/entities/decorators/playableSlotDecorator';
import { Move } from '../../../../../src/domain/entities/move';
import { GenericSlot } from '../../../../../src/domain/entities/slot';
import { MakeMove } from '../../../../../src/domain/use-cases/make-move';
import { InitGame } from '../../../../../src/domain/use-cases/init-game'



jest.mock('../../../../../src/domain/entities/decorators/playableSlotDecorator', () => {
    return {
        PlayableSlot: jest.fn().mockImplementation(() => {
            return {
                getAvailableMoves: jest.fn().mockReturnValue(['0,0','0,1','2,1'])
            }
        })
    }
})
jest.mock('../../../../../src/domain/entities/slot', () => {
    return {
        GenericSlot: jest.fn().mockImplementation(() => {
            return {}
        })
    }
})
jest.mock('../../../../../src/domain/entities/move', () => {
    return {
        Move: jest.fn().mockImplementation((from,to) => {
            return {
                movingFrom: from,
                movingTo: to
            }
        })
    }
})
jest.mock('../../../../../src/domain/entities/board', () => {
    return {
        Board: jest.fn().mockImplementation((x,y) => {
            return {
                getHeight: x,
                getWidth: y,
                slots: {
                    '0,0': new GenericSlot(0,0),
                    '0,1': new PlayableSlot(new GenericSlot(0,1), true),
                    '0,2': new PlayableSlot(new GenericSlot(1,1), true),
                    '1,0': new PlayableSlot(new GenericSlot(1,0), true),
                    '1,1': new PlayableSlot(new GenericSlot(1,1), true),
                    '1,2': new PlayableSlot(new GenericSlot(1,1), true),
                    '2,0': new PlayableSlot(new GenericSlot(1,1), true),
                    '2,1': new PlayableSlot(new GenericSlot(1,1), true),
                    '2,2': new PlayableSlot(new GenericSlot(1,1), true)
                }
            }
        })
    }
})

beforeEach(() => {
    jest.clearAllMocks(); 
});

describe('MakeMove class', () => {

    test('create a new MakeMove', () => {

        const testMove = new MakeMove(new Move('0,1','2,1'), new Board(3,3));

        expect(testMove).toBeInstanceOf(MakeMove);
    })
    test('get move', () => {

        const testMove = new MakeMove(new Move('0,1','2,1'), new Board(3,3));

        expect(testMove.getMove.movingFrom).toBe('0,1');
        expect(testMove.getMove.movingTo).toBe('2,1')

    })
    test('get board', () => {

        const board = new MakeMove(new Move('0,1','2,1'), new Board(3,3)).getBoard

        expect(board.getHeight).toEqual(3);
        expect(board.getWidth).toEqual(3)
    })
    test('intended move is allowed', () => {

        const testMove = new MakeMove(new Move('0,1','2,1'), new Board(3,3))

        const availableMove = testMove.isMoveAllowed();

        expect(availableMove).toBe(true);
    })
    test('intended move is not allowed', () => {

        const testMove = new MakeMove(new Move('0,1','1,1'), new Board(3,3))

        const availableMove = testMove.isMoveAllowed();

        expect(availableMove).toBe(false);
    })
    test("update available moves", () => {

    })
    test('update remaining pins', () => {

    })
    test('update board', () => {

    })
    test('update moves', () => {

    })

})