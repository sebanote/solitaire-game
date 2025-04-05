import { Board } from '../../../../../src/domain/entities/board';
import { PlayableSlot } from '../../../../../src/domain/entities/decorators/playableSlotDecorator';
import { Move } from '../../../../../src/domain/entities/move';
import { GenericSlot } from '../../../../../src/domain/entities/slot';
import { MakeMove } from '../../../../../src/domain/use-cases/make-move';
import { InitGame } from '../../../../../src/domain/use-cases/init-game';
import { UpdateGame } from '../../../../../src/domain/use-cases/update-game'



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

        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const testGame = new InitGame(3,3,testArrangement)
        testGame.setBoard()
        testGame.fillInfluencedSlots()
        
        const testMove = new MakeMove(new Move('2,1','0,1'), testGame.game.getBoard)
        const updateGame = new UpdateGame(testGame.game, testMove)
        updateGame.updateAvailableMoves()

        const availableMove = testMove.isMoveAllowed();

        expect(availableMove).toBe(true);
    })
    test('intended move is not allowed', () => {

        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const testGame = new InitGame(3,3,testArrangement)
        testGame.setBoard()
        testGame.fillInfluencedSlots()
        
        const testMove = new MakeMove(new Move('2,2','0,2'), testGame.game.getBoard)
        const updateGame = new UpdateGame(testGame.game, testMove)
        updateGame.updateAvailableMoves()

        const availableMove = testMove.isMoveAllowed();

        expect(availableMove).toBe(false);
    })
    test('perform allowed move', () => {

        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const testGame = new InitGame(3,3,testArrangement)
        testGame.setBoard()
        testGame.fillInfluencedSlots()
        
        const testMove = new MakeMove(new Move('2,1','0,1'), testGame.game.getBoard)
        const updateGame = new UpdateGame(testGame.game, testMove)
        updateGame.updateAvailableMoves()

        const moved = testMove.performMove(false)

        expect(moved).toBe(true)
        expect((testGame.game.getBoard.slots['2,1'] as PlayableSlot).isTaken()).toBe(false)
        expect((testGame.game.getBoard.slots['1,1'] as PlayableSlot).isTaken()).toBe(false)
        expect((testGame.game.getBoard.slots['0,1'] as PlayableSlot).isTaken()).toBe(true)
    })
    test('perform not allowed move', () => {

        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const testGame = new InitGame(3,3,testArrangement)
        testGame.setBoard()
        testGame.fillInfluencedSlots()
        
        const testMove = new MakeMove(new Move('2,2','0,2'), testGame.game.getBoard)
        const updateGame = new UpdateGame(testGame.game, testMove)
        updateGame.updateAvailableMoves()

        const moved = testMove.performMove(false)

        expect(moved).toBe(false)
        expect((testGame.game.getBoard.slots['2,1'] as PlayableSlot).isTaken()).toBe(true)
        expect((testGame.game.getBoard.slots['1,1'] as PlayableSlot).isTaken()).toBe(true)
        expect((testGame.game.getBoard.slots['0,1'] as PlayableSlot).isTaken()).toBe(false)
    })
})