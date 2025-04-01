import { Game } from '../../domain/entities/game'
import { MakeMove } from './make-move';
import { Move } from '../entities/move';

export class UpdateGame {

    constructor(private game: Game, private makeMove: MakeMove){}

    get getGame(){
        return this.game;
    }

    get getMakeMove(){
        return this.makeMove;
    }

    addNewMove() {
        if(this.makeMove.isMoveAllowed()){
            this.game.addMove(this.makeMove.getMove);
            return true;
        }
        return false;
    }

    removeOneMove() {
        return this.game.rollBackMove();
    }

    removeOnePin() {
        this.game.setPins = this.game.getPins - 1;
    }

    restoreOnePin() {
        this.game.setPins = this.game.getPins + 1;
    }

    updateBoard() {
        this.makeMove.performMove()
    }

    rollBackBoard() {
        const removed = this.removeOneMove();
        
        const backMove = new Move(removed?.movingTo, removed?.movingFrom)
        const rollBackMove = new MakeMove(backMove, this.game.getBoard)
        
        rollBackMove.performMove()

        this.restoreOnePin();
    }
}