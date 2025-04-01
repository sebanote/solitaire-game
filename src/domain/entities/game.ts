import { Board } from '../entities/board';
import { Move } from '../entities/move'

export class Game {
    private moves: Move[] = [];
    private possibleMoves: number = 100;
    private pins: number = 0;

    constructor(private board: Board){console.log('you are instanciating the real Game class')}

    get getBoard(): Board {
        console.log('you are calling get board from the real Game class')
        return this.board as Board;
    }

    get getPins() {
        return this.pins;
    }

    set setPins(pins: number) {
        this.pins = pins;
    }

    get getMoves() {
        return this.moves;
    }

    addMove(move: Move) {
        this.moves.push(move);
    }   

    rollBackMove() {
        if (this.moves.length > 0) {
            return this.moves.pop();
        }
    }
}