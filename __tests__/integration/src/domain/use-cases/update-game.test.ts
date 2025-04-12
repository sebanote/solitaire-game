import { UpdateGame } from '../../../../../src/domain/use-cases/update-game'
import { Game } from '../../../../../src/domain/entities/game'
import { Board } from '../../../../../src/domain/entities/board'
import { PlayableSlot } from '../../../../../src/domain/entities/decorators/playableSlotDecorator';
import { MakeMove } from '../../../../../src/domain/use-cases/make-move';
import { Move } from '../../../../../src/domain/entities/move'
import { InitGame } from '../../../../../src/domain/use-cases/init-game';


describe('UpdateGame class', () => {

    test('Init UpdateGame', () => {
        
        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const initGame = new InitGame(3,3,testArrangement)
        const makeMove = new MakeMove(new Move('2,1','0,1'), initGame.game.getBoard)
        const updateGame = new UpdateGame(initGame.game, makeMove)

        expect(updateGame).toBeInstanceOf(UpdateGame);

    })
    test('get game', () => {

        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const initGame = new InitGame(3,3,testArrangement)
        const makeMove = new MakeMove(new Move('2,1','0,1'), initGame.game.getBoard)
        const updateGame = new UpdateGame(initGame.game, makeMove)

        expect(updateGame.getGame).toBe(initGame.game)
    })
    test('get MakeMove', () => {

        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const initGame = new InitGame(3,3,testArrangement)
        const makeMove = new MakeMove(new Move('2,1','0,1'), initGame.game.getBoard)
        const updateGame = new UpdateGame(initGame.game, makeMove)

        expect(updateGame.getMakeMove).toEqual(makeMove);
    })
    test('add new move', () => {
        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const initGame = new InitGame(3,3,testArrangement)
        initGame.setBoard()
        initGame.fillInfluencedSlots()
        const makeMove = new MakeMove(new Move('2,1','0,1'), initGame.game.getBoard)
        const updateGame = new UpdateGame(initGame.game, makeMove)
        updateGame.updateAvailableMoves()

        updateGame.addNewMove()

        expect(updateGame.getGame.getMoves[0].movingFrom).toBe('2,1')
        expect(updateGame.getGame.getMoves[0].movingTo).toBe('0,1')
    })

    test('rollback move', () => {
        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const initGame = new InitGame(3,3,testArrangement)
        initGame.setBoard()
        initGame.fillInfluencedSlots()
        const makeMove = new MakeMove(new Move('2,1','0,1'), initGame.game.getBoard)
        const updateGame = new UpdateGame(initGame.game, makeMove)
        updateGame.updateAvailableMoves()
        updateGame.addNewMove()

        updateGame.removeOneMove();

        expect(updateGame.getGame.getMoves).toEqual([])
    })

    test('update board on move', () => {
        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const initGame = new InitGame(3,3,testArrangement)
        initGame.setBoard()
        initGame.fillInfluencedSlots()

        const makeMove = new MakeMove(new Move('2,1','0,1'), initGame.game.getBoard)
        const updateGame = new UpdateGame(initGame.game, makeMove)
        updateGame.updateAvailableMoves()
        updateGame.updateBoard()

        expect((initGame.game.getBoard.slots['2,1'] as PlayableSlot).isTaken()).toBe(false)
        expect((initGame.game.getBoard.slots['1,1'] as PlayableSlot).isTaken()).toBe(false)
        expect((initGame.game.getBoard.slots['0,1'] as PlayableSlot).isTaken()).toBe(true)
    })

    test('rollback board on move rollback', () => {
        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const initGame = new InitGame(3,3,testArrangement)
        initGame.setBoard()
        initGame.fillInfluencedSlots()

        const makeMove = new MakeMove(new Move('2,1','0,1'), initGame.game.getBoard)
        const updateGame = new UpdateGame(initGame.game, makeMove)
        updateGame.updateAvailableMoves()
        updateGame.addNewMove()
        updateGame.updateBoard()        

        updateGame.rollBackBoard();

        expect((initGame.game.getBoard.slots['2,1'] as PlayableSlot).isTaken()).toBe(true)
        expect((initGame.game.getBoard.slots['1,1'] as PlayableSlot).isTaken()).toBe(true)
        expect((initGame.game.getBoard.slots['0,1'] as PlayableSlot).isTaken()).toBe(false)
        
    });

    test('update available moves for a particular slot', () => {
        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const initGame = new InitGame(3,3,testArrangement)
        initGame.setBoard()
        initGame.fillInfluencedSlots()

        const makeMove = new MakeMove(new Move('2,1','0,1'), initGame.game.getBoard)
        const updateGame = new UpdateGame(initGame.game, makeMove)
        updateGame.updateAvailableMoves()

        expect((initGame.game.getBoard.slots['2,1'] as PlayableSlot).getAvailableMoves()).toEqual(['0,1'])

        updateGame.addNewMove()
        updateGame.updateBoard()    

        updateGame.updateAvailableMoves(['2,1']);

        expect((initGame.game.getBoard.slots['2,1'] as PlayableSlot).getAvailableMoves()).toEqual([])

    })

    test('update available moves for three slots involved in a move', () => {
        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const initGame = new InitGame(3,3,testArrangement)
        initGame.setBoard()
        initGame.fillInfluencedSlots()

        const makeMove = new MakeMove(new Move('2,1','0,1'), initGame.game.getBoard)
        const updateGame = new UpdateGame(initGame.game, makeMove)
        updateGame.updateAvailableMoves()

        expect((initGame.game.getBoard.slots['2,1'] as PlayableSlot).getAvailableMoves()).toEqual(['0,1'])
        expect((initGame.game.getBoard.slots['1,1'] as PlayableSlot).getAvailableMoves()).toEqual([])
        expect((initGame.game.getBoard.slots['0,1'] as PlayableSlot).getAvailableMoves()).toEqual([])

        updateGame.addNewMove()
        updateGame.updateBoard() 
        
        updateGame.updateAvailableMoves(['2,1','1,1','0,1'])

        expect((initGame.game.getBoard.slots['2,1'] as PlayableSlot).getAvailableMoves()).toEqual([])
        expect((initGame.game.getBoard.slots['1,1'] as PlayableSlot).getAvailableMoves()).toEqual([])
        expect((initGame.game.getBoard.slots['0,1'] as PlayableSlot).getAvailableMoves()).toEqual([])
    })

    test('update available moves for all slots when no slots are specified', () => {
        const testArrangement = [
            [true,false,true],
            [true,true,true],
            [true,true,true],
        ]

        const initGame = new InitGame(3,3,testArrangement)
        initGame.setBoard()
        initGame.fillInfluencedSlots()

        const makeMove = new MakeMove(new Move('2,1','0,1'), initGame.game.getBoard)
        const updateGame = new UpdateGame(initGame.game, makeMove)

        const _setAvailableMoves = jest.spyOn(PlayableSlot.prototype, 'setAvailableMoves')

        updateGame.updateAvailableMoves()

        expect(_setAvailableMoves).toHaveBeenCalledTimes(9);
        expect((initGame.game.getBoard.slots['2,1'] as PlayableSlot).getAvailableMoves()).toEqual(['0,1'])
    });

    test('find all involved slots', () => {
        const testArrangement = [
            [true, false, true],
            [true, true, true],
            [true, true, true],
        ];

        const initGame = new InitGame(3, 3, testArrangement);
        initGame.setBoard();
        initGame.fillInfluencedSlots();

        const makeMove = new MakeMove(new Move('2,1', '0,1'), initGame.game.getBoard);
        const updateGame = new UpdateGame(initGame.game, makeMove);

        const involvedSlots = updateGame.findAllInvolvedSlots();

        expect(involvedSlots).toContain('2,1');
        expect(involvedSlots).toContain('1,1');
        expect(involvedSlots).toContain('0,1');
    });

    test('update the game', () => {
        const testArrangement = [
            [true, false, true],
            [true, true, true],
            [true, true, true],
        ];

        const initGame = new InitGame(3, 3, testArrangement);
        initGame.setBoard();
        initGame.fillInfluencedSlots();

        const makeMove = new MakeMove(new Move('2,1', '0,1'), initGame.game.getBoard);
        const updateGame = new UpdateGame(initGame.game, makeMove);
        updateGame.updateAvailableMoves()
        const  gameFinished = updateGame.updateTheGame();

        expect(gameFinished).toEqual(true);
        expect(initGame.game.getPins).toEqual(7);
        expect(updateGame.getGame.getMoves.length).toBe(1);
        expect(updateGame.getGame.getMoves[0].movingFrom).toBe('2,1');
        expect(updateGame.getGame.getMoves[0].movingTo).toBe('0,1');
        expect(updateGame.getGame.possibleMoves).toEqual(0)
    });
})