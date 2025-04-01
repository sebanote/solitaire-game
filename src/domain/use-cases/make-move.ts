import { Board } from '../entities/board';
import { PlayableSlot } from '../entities/decorators/playableSlotDecorator';
import { Move } from '../entities/move'
import { GenericSlot } from '../entities/slot';

export class MakeMove {

    constructor(private move: Move, private board: Board){
        this.midSlot = this.findMidSlot() 
    }

    private midSlot: PlayableSlot;

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

    findMidSlot(): PlayableSlot{
        const x_diff = this.board.slots[this.move.movingTo].position_x - this.board.slots[this.move.movingFrom].position_x
        const midSlot_x = x_diff > 0 ? this.board.slots[this.move.movingFrom].position_x + 1 : this.board.slots[this.move.movingFrom].position_x - 1;

        const y_diff = this.board.slots[this.move.movingTo].position_y - this.board.slots[this.move.movingFrom].position_y
        const midSlot_y = y_diff > 0 ? this.board.slots[this.move.movingFrom].position_y + 1 : this.board.slots[this.move.movingFrom].position_y - 1;

        return new PlayableSlot(new GenericSlot(midSlot_x, midSlot_y), false)
    }

    performMove() {
        (this.board.slots[this.move.movingFrom] as PlayableSlot).setTaken(false);
        (this.board.slots[this.move.movingTo] as PlayableSlot).setTaken(true);
    }
}