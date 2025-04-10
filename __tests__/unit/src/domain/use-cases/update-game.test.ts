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
                _possibleMoves: 1,
                pins: 1,
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
                },
                get possibleMoves() {return this._possibleMoves},
                set possibleMoves(moves:number){}
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
                isTaken: jest.fn()
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
        expect(game.getPins).toBe(2); 
    });

    test('update available moves for a particular slot', () => {
        const game = new Game(new Board(3,3));
        const move = new Move('0,0','0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        Object.setPrototypeOf(game.getBoard.slots['0,0'], PlayableSlot.prototype)

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([[],['0,1','0,2'],[],[]])

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'getAvailableMoves').mockReturnValue(['0,2'])

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['0,1'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['0,2'] as PlayableSlot, 'isTaken').mockReturnValue(false);

        updateGame.updateAvailableMoves(['0,0']);

        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith(['0,2']);

    })

    test('update available moves for three slots involved in a move', () => {
        const game = new Game(new Board(3,3));
        const move = new Move('0,0','0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        Object.setPrototypeOf(game.getBoard.slots['0,0'], PlayableSlot.prototype)
        Object.setPrototypeOf(game.getBoard.slots['0,1'], PlayableSlot.prototype)
        Object.setPrototypeOf(game.getBoard.slots['0,2'], PlayableSlot.prototype)

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([[],['0,1','0,2'],[],[]])
        jest.spyOn(game.getBoard.slots['0,1'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([[],[],[],[]])
        jest.spyOn(game.getBoard.slots['0,2'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([[],[],[],[]])

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'getAvailableMoves').mockReturnValue(['0,2'])
        jest.spyOn(game.getBoard.slots['0,1'] as PlayableSlot, 'getAvailableMoves').mockReturnValue([])
        jest.spyOn(game.getBoard.slots['0,2'] as PlayableSlot, 'getAvailableMoves').mockReturnValue([])

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['0,1'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['0,2'] as PlayableSlot, 'isTaken').mockReturnValue(false);

        updateGame.updateAvailableMoves(['0,0','0,1','0,2']);

        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith(['0,2']);
        expect((game.getBoard.slots['0,1'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['0,1'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith([]);
        expect((game.getBoard.slots['0,2'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['0,2'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith([]);
    })

    test('update available moves for all slots when no slots are specified', () => {
        const game = new Game(new Board(3, 3));
        const move = new Move('0,0', '0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        Object.setPrototypeOf(game.getBoard.slots['0,0'], PlayableSlot.prototype)
        Object.setPrototypeOf(game.getBoard.slots['1,0'], PlayableSlot.prototype)
        Object.setPrototypeOf(game.getBoard.slots['2,0'], PlayableSlot.prototype)

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([['0,1', '0,2']]);
        jest.spyOn(game.getBoard.slots['0,1'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['0,2'] as PlayableSlot, 'isTaken').mockReturnValue(false);

        jest.spyOn(game.getBoard.slots['1,0'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([['1,1', '1,2']]);
        jest.spyOn(game.getBoard.slots['1,1'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['1,2'] as PlayableSlot, 'isTaken').mockReturnValue(false);

        jest.spyOn(game.getBoard.slots['2,0'] as PlayableSlot, 'getInfluencedSlots', 'get').mockReturnValue([['2,1', '2,2']]);
        jest.spyOn(game.getBoard.slots['2,1'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['2,2'] as PlayableSlot, 'isTaken').mockReturnValue(false);

        updateGame.updateAvailableMoves();

        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith(['0,2']);
        expect((game.getBoard.slots['1,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['1,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith(['1,2']);
        expect((game.getBoard.slots['2,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledTimes(1);
        expect((game.getBoard.slots['2,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith(['2,2']);
    });

    test('update available moves when no influenced slots are valid', () => {
        const game = new Game(new Board(3, 3));
        const move = new Move('0,0', '0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        Object.setPrototypeOf(game.getBoard.slots['0,0'], PlayableSlot.prototype)

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

        Object.setPrototypeOf(game.getBoard.slots['0,0'], PlayableSlot.prototype)
        Object.setPrototypeOf(game.getBoard.slots['1,0'], PlayableSlot.prototype)

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
        expect((game.getBoard.slots['0,0'] as PlayableSlot).setAvailableMoves).toHaveBeenCalledWith(['0,2']);
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

    test('update game on allowed move', () => {
        const game = new Game(new Board(3,3));
        const move = new Move('2,1','0,1');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);
        updateGame.updateAvailableMoves();

        const updated = updateGame.updateTheGame();

        expect(updated).not.toBe([])
        expect(updateGame.getMakeMove.isMoveAllowed()).toBe(true)
    })

    test('update game on not allowed move', () => {
        const game = new Game(new Board(3,3));
        const move = new Move('2,2','2,0');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);
        updateGame.updateAvailableMoves();

        const mockRejected = jest.spyOn(updateGame.getMakeMove, 'isMoveAllowed').mockReturnValue(false)

        const updated = updateGame.updateTheGame();

        expect(mockRejected).toHaveBeenCalledTimes(1)
    })

    test('updatePossibleMoves calculates the correct number of possible moves', () => {
        const game = new Game(new Board(3, 3));
        const move = new Move('0,0', '0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        // Override the prototype to make the mock pass the instanceof check
        Object.setPrototypeOf(game.getBoard.slots['0,0'], PlayableSlot.prototype);
        Object.setPrototypeOf(game.getBoard.slots['0,1'], PlayableSlot.prototype);
        Object.setPrototypeOf(game.getBoard.slots['0,2'], PlayableSlot.prototype);

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'getAvailableMoves').mockReturnValue(['0,1', '0,2']);
        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'isTaken').mockReturnValue(true);

        jest.spyOn(game.getBoard.slots['0,1'] as PlayableSlot, 'getAvailableMoves').mockReturnValue([]);
        jest.spyOn(game.getBoard.slots['0,1'] as PlayableSlot, 'isTaken').mockReturnValue(false);

        jest.spyOn(game.getBoard.slots['0,2'] as PlayableSlot, 'getAvailableMoves').mockReturnValue(['1,2']);
        jest.spyOn(game.getBoard.slots['0,2'] as PlayableSlot, 'isTaken').mockReturnValue(true);

        const possibleMoves = updateGame.updatePossibleMoves();

        expect(possibleMoves).toBe(3); // 2 moves from '0,0' and 1 move from '0,2'
    });

    test('updatePossibleMoves returns 0 when no slots are taken', () => {
        const game = new Game(new Board(3, 3));
        const move = new Move('0,0', '0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        // Override the prototype to make the mock pass the instanceof check
        Object.setPrototypeOf(game.getBoard.slots['0,0'], PlayableSlot.prototype);
        Object.setPrototypeOf(game.getBoard.slots['0,1'], PlayableSlot.prototype);
        Object.setPrototypeOf(game.getBoard.slots['0,2'], PlayableSlot.prototype);
        Object.setPrototypeOf(game.getBoard.slots['1,0'], PlayableSlot.prototype);
        Object.setPrototypeOf(game.getBoard.slots['1,1'], PlayableSlot.prototype);
        Object.setPrototypeOf(game.getBoard.slots['1,2'], PlayableSlot.prototype);
        Object.setPrototypeOf(game.getBoard.slots['2,0'], PlayableSlot.prototype);
        Object.setPrototypeOf(game.getBoard.slots['2,1'], PlayableSlot.prototype);
        Object.setPrototypeOf(game.getBoard.slots['2,2'], PlayableSlot.prototype);

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'isTaken').mockReturnValue(false)
        jest.spyOn(game.getBoard.slots['0,1'] as PlayableSlot, 'isTaken').mockReturnValue(false);
        jest.spyOn(game.getBoard.slots['0,2'] as PlayableSlot, 'isTaken').mockReturnValue(false);
        jest.spyOn(game.getBoard.slots['1,0'] as PlayableSlot, 'isTaken').mockReturnValue(false);
        jest.spyOn(game.getBoard.slots['1,1'] as PlayableSlot, 'isTaken').mockReturnValue(false);
        jest.spyOn(game.getBoard.slots['1,2'] as PlayableSlot, 'isTaken').mockReturnValue(false);
        jest.spyOn(game.getBoard.slots['2,0'] as PlayableSlot, 'isTaken').mockReturnValue(false);
        jest.spyOn(game.getBoard.slots['2,1'] as PlayableSlot, 'isTaken').mockReturnValue(false);
        jest.spyOn(game.getBoard.slots['2,2'] as PlayableSlot, 'isTaken').mockReturnValue(false);

        const possibleMoves = updateGame.updatePossibleMoves();

        expect(possibleMoves).toBe(0);
    });

    test('updatePossibleMoves skips non-PlayableSlot slots', () => {
        const game = new Game(new Board(3, 3));
        const move = new Move('0,0', '0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        // Override the prototype to make the mock pass the instanceof check
        Object.setPrototypeOf(game.getBoard.slots['0,0'], PlayableSlot.prototype);

        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'isTaken').mockReturnValue(true);
        jest.spyOn(game.getBoard.slots['0,0'] as PlayableSlot, 'getAvailableMoves').mockReturnValue(['0,1']);

        game.getBoard.slots['0,1'] = {} as GenericSlot; // Non-PlayableSlot

        const possibleMoves = updateGame.updatePossibleMoves();

        expect(possibleMoves).toBe(1);

    })

    test('updatePossibleMoves handles empty board slots', () => {
        const game = new Game(new Board(0, 0)); // Empty board
        const move = new Move('0,0', '0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        const possibleMoves = updateGame.updatePossibleMoves();

        expect(possibleMoves).toBe(0);
    });

    test('game is finished', () => {
        const game = new Game(new Board(0, 0)); // Empty board
        const move = new Move('0,0', '0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        jest.spyOn(game, 'possibleMoves', 'get').mockReturnValue(0)

        const finished = updateGame.isGameFinished()

        expect(finished).toBe(true)

    })

    test('game is not finished', () => {
        const game = new Game(new Board(0, 0)); // Empty board
        const move = new Move('0,0', '0,2');
        const makeMove = new MakeMove(move, game.getBoard);
        const updateGame = new UpdateGame(game, makeMove);

        jest.spyOn(game, 'possibleMoves', 'get').mockReturnValue(1)

        const finished = updateGame.isGameFinished()

        expect(finished).toBe(false)
    })

})