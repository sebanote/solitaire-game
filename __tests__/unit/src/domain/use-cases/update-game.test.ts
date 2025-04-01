import { UpdateGame } from '../../../../../src/domain/use-cases/update-game'
import { Game } from '../../../../../src/domain/entities/game'
import { Board } from '../../../../../src/domain/entities/board'
import { PlayableSlot } from '../../../../../src/domain/entities/decorators/playableSlotDecorator';
import { GenericSlot } from '../../../../../src/domain/entities/slot';
import { MakeMove } from '../../../../../src/domain/use-cases/make-move';
import { Move } from '../../../../../src/domain/entities/move'


jest.mock('../../../../../src/domain/entities/game', () => {
    return {
        Game: jest.fn().mockImplementation((board) => {
            console.log('Mocked Gameee')
            return {
                moves: [new Move('0,0','1,0')],
                possibleMoves: 100,
                pins: 100,
                board: board,
                addMove: jest.fn().mockImplementation(() => {
                    //console.log(move.movingFrom)
                }),
                rollBackMove: jest.fn(),
                get getPins () {
                    console.log('get pins')
                    return this.pins;
                },
                set setPins(pin: number) {
                    console.log('set pins')
                    this.pins = pin
                },
                performMove: jest.fn()
            }
        })
    }
})
jest.mock('../../../../../src/domain/entities/decorators/playableSlotDecorator', () => {
    return {
        PlayableSlot: jest.fn().mockImplementation(() => {
            console.log('mocked PlayableSlot')
            return {
                getAvailableMoves: jest.fn().mockReturnValue(['0,0','0,1','2,1'])
            }
        })
    }
})
jest.mock('../../../../../src/domain/entities/slot', () => {
    return {
        GenericSlot: jest.fn().mockImplementation(() => {
            console.log('mocked GenericSlot')
            return {}
        })
    }
})
jest.mock('../../../../../src/domain/entities/move', () => {
    return {
        Move: jest.fn().mockImplementation((from,to) => {
            console.log("Mocked Move")
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
            console.log("Mocked Boardee")
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
jest.mock('../../../../../src/domain/use-cases/make-move', () => {
    return {
        MakeMove: jest.fn().mockImplementation(() => {
            console.log("Mocked MakeMove")
            return {
                getMove: jest.fn().mockImplementation(() => {
                    console.log("mocked getMove function")
                    return {
                        move: new Move('8,8','8,9')
                    }
                }),
                isMoveAllowed: jest.fn().mockReturnValue(true),
                performMove: jest.fn()
            }
        })
    }
})

describe('UpdateGame class', () => {

    test('Init UpdateGame', () => {

        const game = new Game(new Board(3,3))

        const updateGame = new UpdateGame(game, new MakeMove(new Move('0,0','0,2'), game.getBoard));

        expect(updateGame).toBeInstanceOf(UpdateGame);
    })
    test('get game', () => {

        const game = new Game(new Board(3,3))
        const updateGame = new UpdateGame(game, new MakeMove(new Move('0,0','0,2'), game.getBoard));

        expect(updateGame.getGame).toBe(game)
    })
    test('get MakeMove', () => {

        const game = new Game(new Board(3,3))
        const move = new Move('0,0','0,2');
        const makeMove = new MakeMove(move,game.getBoard)
        const updateGame = new UpdateGame(game, makeMove);

        expect(updateGame.getMakeMove).toEqual(makeMove);
    })
    test('add new move', () => {
        const game = new Game(new Board(3,3))
        const move = new Move('0,0','0,2');
        const makeMove = new MakeMove(move,game.getBoard)
        const updateGame = new UpdateGame(game, makeMove);

        updateGame.addNewMove()

        expect(makeMove.isMoveAllowed).toHaveBeenCalledTimes(1);
        expect(makeMove.isMoveAllowed()).toBe(true);
        expect(game.addMove).toHaveBeenCalledTimes(1);
    })
    test('add new move should fail if move not allowed', () => {
        const game = new Game(new Board(3,3))
        const move = new Move('0,0','0,2');
        const makeMove = new MakeMove(move,game.getBoard)
        const updateGame = new UpdateGame(game, makeMove);

        //uses spyOn to ovewrite the default mocked function
        jest.spyOn(makeMove, 'isMoveAllowed').mockImplementation(() => false);

        updateGame.addNewMove()

        expect(makeMove.isMoveAllowed).toHaveBeenCalledTimes(1);
        expect(makeMove.isMoveAllowed()).toBe(false);
        expect(game.addMove).toHaveBeenCalledTimes(0);
    })
    test('rollback move', () => {
        const game = new Game(new Board(3,3))
        const move = new Move('0,0','0,2');
        const makeMove = new MakeMove(move,game.getBoard)
        const updateGame = new UpdateGame(game, makeMove);

        updateGame.removeOneMove();

        expect(game.rollBackMove).toHaveBeenCalledTimes(1)
    })

    test('remove one pin on move', () => {
        const game = new Game(new Board(3,3))
        const move = new Move('0,0','0,2');
        const makeMove = new MakeMove(move,game.getBoard)
        const updateGame = new UpdateGame(game, makeMove);

        const pins = game.getPins;

        updateGame.removeOnePin()

        expect(game.getPins).toEqual(pins - 1)
    })

    test('restore one pin on move rollback', () => {
        const game = new Game(new Board(3,3))
        const move = new Move('0,0','0,2');
        const makeMove = new MakeMove(move,game.getBoard)
        const updateGame = new UpdateGame(game, makeMove);

        const pins = game.getPins;

        updateGame.restoreOnePin()

        expect(game.getPins).toEqual(pins + 1)
    })

    test('update board on move', () => {
        const game = new Game(new Board(3,3));
        const move = new Move('0,0','0,2');
        const makeMove = new MakeMove(move,game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        updateGame.updateBoard();

        expect(makeMove.performMove).toHaveBeenCalledTimes(1);
    })

    test('rollback board on move rollback', () => {
        const game = new Game(new Board(3,3));
        const move = new Move('0,0','0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        const removedMove = { movingFrom: '1,1', movingTo: '2,2' };
        jest.spyOn(game, 'rollBackMove').mockReturnValue(removedMove);

        updateGame.rollBackBoard();

        expect(game.rollBackMove).toHaveBeenCalledTimes(1);
        expect(Move).toHaveBeenCalledWith(removedMove.movingTo, removedMove.movingFrom);
        expect(MakeMove).toHaveBeenCalledWith(expect.any(Object), game.getBoard);
        expect(game.getPins).toBe(101); 
    });

})