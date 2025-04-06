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
            return {
                moves: [new Move('0,0','1,0')],
                possibleMoves: 100,
                pins: 100,
                board: board,
                addMove: jest.fn().mockImplementation(() => {
                }),
                rollBackMove: jest.fn(),
                get getPins () {
                    return this.pins;
                },
                set setPins(pin: number) {
                    this.pins = pin
                },
                performMove: jest.fn(),
                get getBoard () {
                    return board;
                }
            }
        })
    }
})
jest.mock('../../../../../src/domain/entities/decorators/playableSlotDecorator', () => {
    return {
        PlayableSlot: jest.fn().mockImplementation(() => {
            return {
                getAvailableMoves: jest.fn().mockReturnValue(['0,0','0,1','2,1']),
                setAvailableMoves: jest.fn().mockImplementation((arg:any) => {
                    return arg
                }),
                get getInfluencedSlots () {
                    return [['0,0','0,1'],['2,1'],[],[]]
                },
                isTaken: jest.fn().mockReturnValueOnce(true)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
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
                    '0,0': new PlayableSlot(new GenericSlot(0,0), true),
                    '0,1': new PlayableSlot(new GenericSlot(0,1), false),
                    '0,2': new PlayableSlot(new GenericSlot(0,2), true),
                    '1,0': new PlayableSlot(new GenericSlot(1,0), true),
                    '1,1': new PlayableSlot(new GenericSlot(1,1), true),
                    '1,2': new PlayableSlot(new GenericSlot(1,2), true),
                    '2,0': new PlayableSlot(new GenericSlot(2,0), true),
                    '2,1': new PlayableSlot(new GenericSlot(2,1), true),
                    '2,2': new PlayableSlot(new GenericSlot(2,2), true)
                }
            }
        })
    }
})
jest.mock('../../../../../src/domain/use-cases/make-move', () => {
    return {
        MakeMove: jest.fn().mockImplementation((move) => {
            return {
                get getMove() {
                    return move
                },
                isMoveAllowed: jest.fn().mockReturnValue(true),
                performMove: jest.fn(),
                findMidSlot: jest.fn().mockReturnValue('1,1')
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

        expect(game.addMove).toHaveBeenCalledTimes(1);
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

    test('update available moves for a particular slot', () => {
        const game = new Game(new Board(3,3));
        const move = new Move('0,0','0,0');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        updateGame.updateAvailableMoves(['2,1']);

        expect((game.getBoard.slots['2,1'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['2,1'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith([]);

    })

    test('update available moves for three slots involved in a move', () => {
        const game = new Game(new Board(3,3));
        const move = new Move('0,0','0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        updateGame.updateAvailableMoves(['0,0','0,1','0,2']);

        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith([]);
        expect((game.getBoard.slots['0,1'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['0,1'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith([]);
        expect((game.getBoard.slots['0,2'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['0,2'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith(['0,1']);
    })

    test('update available moves for specific slots with valid influenced slots', () => {
        const game = new Game(new Board(3, 3));
        const move = new Move('0,0', '0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([
            ['0,1', '0,2'],
            ['1,0', '1,1']
        ]);
        jest.spyOn(game.getBoard.slots['0,1'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['0,2'] as PlayableSlot, 'isTaken').mockReturnValue(false);
        jest.spyOn(game.getBoard.slots['1,0'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['1,1'] as PlayableSlot, 'isTaken').mockReturnValue(true);

        updateGame.updateAvailableMoves(['0,0']);

        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith([]);
    });

    test('update available moves for all slots when no slots are specified', () => {
        const game = new Game(new Board(3, 3));
        const move = new Move('0,0', '0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([
            ['0,1', '0,2']
        ]);
        jest.spyOn(game.getBoard.slots['0,1'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['0,2'] as PlayableSlot, 'isTaken').mockReturnValue(false);

        jest.spyOn(game.getBoard.slots['1,0'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([
            ['1,1', '1,2']
        ]);
        jest.spyOn(game.getBoard.slots['1,1'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['1,2'] as PlayableSlot, 'isTaken').mockReturnValue(false);

        updateGame.updateAvailableMoves();

        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith([]);
        expect((game.getBoard.slots['1,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['1,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith([]);
    });

    test('update available moves when no influenced slots are valid', () => {
        const game = new Game(new Board(3, 3));
        const move = new Move('0,0', '0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([
            ['0,1', '0,2']
        ]);
        jest.spyOn(game.getBoard.slots['0,1'] as PlayableSlot, 'isTaken').mockReturnValue(false);
        jest.spyOn(game.getBoard.slots['0,2'] as PlayableSlot, 'isTaken').mockReturnValue(true);

        updateGame.updateAvailableMoves(['0,0']);

        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith([]);
    });

    test('update available moves for multiple slots with mixed valid and invalid influenced slots', () => {
        const game = new Game(new Board(3, 3));
        const move = new Move('0,0', '0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([
            ['0,1', '0,2']
        ]);
        jest.spyOn(game.getBoard.slots['0,1'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['0,2'] as PlayableSlot, 'isTaken').mockReturnValue(false);

        jest.spyOn(game.getBoard.slots['1,0'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([
            ['1,1', '1,2']
        ]);
        jest.spyOn(game.getBoard.slots['1,1'] as PlayableSlot, 'isTaken').mockReturnValue(false);
        jest.spyOn(game.getBoard.slots['1,2'] as PlayableSlot, 'isTaken').mockReturnValue(true);

        updateGame.updateAvailableMoves(['0,0', '1,0']);

        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith([]);
        expect((game.getBoard.slots['1,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['1,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith([]);
    });

    test('find all involved slots', () => {
        const game = new Game(new Board(3,3));
        const move = new Move('2,1','0,1');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);
        updateGame.updateAvailableMoves();

        const involved = updateGame.findAllInvolvedSlots();

        expect(involved).toEqual(["0,0","0,1","2,1",])
        expect(makeMove.findMidSlot).toHaveBeenCalledTimes(1)
    })

})