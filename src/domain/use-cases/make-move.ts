import { Board } from '../entities/board';
import { PlayableSlot } from '../entities/decorators/playableSlotDecorator';
import { Move } from '../entities/move'

export class MakeMove {

    constructor(private move: Move, private board: Board){}

    get getMove() {
        return this.move;
    }

    get getBoard() {
        return this.board;
    }

    isMoveAllowed(): boolean {
        const availableMoves = (this.board.slots[this.move.movingFrom] as PlayableSlot).getAvailableMoves();
        if(availableMoves.includes(this.move.movingTo))
            return true;
        return false;
    }



}