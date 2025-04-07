import { Board } from '../entities/board';
import { Move } from '../entities/move'

export class Game {
    private moves: Move[] = [];
    private _possibleMoves: number = 0;
    private pins: number = 0;

    constructor(private board: Board){}

    get getBoard(): Board {
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

    get possibleMoves(){
        return this._possibleMoves;
    }

    set possibleMoves(moves:number){
        this._possibleMoves = moves;
    }
}