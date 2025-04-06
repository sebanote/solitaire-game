import { Board } from '../entities/board';
import { PlayableSlot } from '../entities/decorators/playableSlotDecorator';
import { Move } from '../entities/move'
import { Slot  } from '../entities/slot';

export class MakeMove {

    constructor(private move: Move, private board: Board){
        this.midSlot = this.board.slots[this.findMidSlot()];
    }

    private midSlot: Slot;

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

    findMidSlot(): string {
         const from = this.move.movingFrom.split(',');
         const to = this.move.movingTo.split(',')

         const from_x = +from[0]
         const from_y = +from[1]
         const to_x = +to[0]
         const to_y = +to[1]

         const midSlot_x = from_x + (to_x - from_x)/2
         const midSlot_y = from_y + (to_y - from_y)/2
         return midSlot_x + ',' + midSlot_y;
    }

    performMove(back: boolean): boolean {
        if(!back){
            if(this.isMoveAllowed()){
                (this.board.slots[this.move.movingFrom] as PlayableSlot).setTaken(false);
                (this.board.slots[this.move.movingTo] as PlayableSlot).setTaken(true);
                (this.board.slots[this.midSlot.position_x + ',' + this.midSlot.position_y] as PlayableSlot).setTaken(false);
                return true;
            }
        }
        else {
            (this.board.slots[this.move.movingFrom] as PlayableSlot).setTaken(false);
            (this.board.slots[this.move.movingTo] as PlayableSlot).setTaken(true);
            (this.board.slots[this.midSlot.position_x + ',' + this.midSlot.position_y] as PlayableSlot).setTaken(true);
            return true;
        }
        
        return false;
    }
}