import { Board } from '../entities/board';
import { PlayableSlot } from '../entities/decorators/playableSlotDecorator';
import { GenericSlot } from '../entities/slot';
import { Game } from '../entities/game';
import { InfluencedSlot } from '../entities/interfaces/influencedSlot';

export class InitGame {

    constructor(private width: number, private height: number, private arrangement: Array<Array<null | boolean>>){
        this.board = new Board(this.width, this.height);
        this.game = new Game(this.board as Board);
    }

    private game: Game;
    private possibleMoves: number = 100;
    private board: object | Board = {};
    private pins: number = 0

    setBoard(): boolean {
        try{

            for(let y = 0; y < this.height; y++){
                for(let x = 0; x < this.width; x++){
                    const index = y + "," + x;
                    if(this.arrangement[y][x] != null){
                        (this.board as Board).slots[index] = new PlayableSlot(new GenericSlot(x,y), this.arrangement[y][x] as boolean);
                        if(this.arrangement[y][x])
                            this.pins += 1;
                    }
                    else
                        (this.board as Board).slots[index] = new GenericSlot(x,y);
                }
            }
            return true;
        }
        catch(e){
            console.error(e);
            return false;
        }
    }

    getBoard(): Board {
        return this.board as Board;
    }

    getPins() {
        return this.pins;
    }

    setPins(pins: number) {
        this.pins = pins;
    }

    fillInfluencedSlots(): boolean {

        const slots = Object.keys((this.board as Board).slots)

        const max_x = (this.board as Board).getWidth - 1;
        const max_y = (this.board as Board).getHeight - 1;

        for(let slot of slots){

            const board = (this.board as Board);

            const next: string[] = [];
            const aim: string[] = [];

            let slotPosition = slot.split(',')

            let slot_x = +slotPosition[1]
            let slot_y = +slotPosition[0]

            let next_left_x = slot_x - 1 >= 0 ? slot_x - 1 : -1;
            let next_right_x = slot_x + 1 <= max_x ? slot_x + 1 : -1;
            let next_up_y = slot_y - 1 >= 0 ? slot_y - 1 : -1;
            let next_down_y = slot_y + 1 <= max_y ? slot_y + 1 : -1;

            let aim_left_x = slot_x - 2 >= 0 ? slot_x - 2 : -1;
            let aim_right_x = slot_x + 2 <= max_x ? slot_x + 2 : -1;
            let aim_up_y = slot_y - 2 >= 0 ? slot_y - 2 : -1;
            let aim_down_y = slot_y + 2 <= max_y ? slot_y + 2 : -1;

            if(next_left_x > -1 && board.slots[slot_y + ',' + next_left_x] instanceof PlayableSlot){
                next.push(slot_y + ',' + next_left_x);
            }
            if(next_right_x > -1 && board.slots[slot_y + ',' + next_right_x] instanceof PlayableSlot){
                next.push(slot_y + ',' + next_right_x );
            }
            if(next_up_y > -1 && board.slots[next_up_y + ',' + slot_x] instanceof PlayableSlot){
                next.push(next_up_y + ',' + slot_x);
            }
            if(next_down_y > -1 && board.slots[next_down_y + ',' + slot_x] instanceof PlayableSlot){
                next.push(next_down_y + ',' + slot_x); 
            }

            if(aim_left_x > -1 && board.slots[slot_y + ',' + aim_left_x] instanceof PlayableSlot){
                aim.push(slot_y + ',' + aim_left_x);
            }
            if(aim_right_x > -1 && board.slots[slot_y + ',' + aim_right_x] instanceof PlayableSlot){
                aim.push(slot_y + ',' + aim_right_x);
            }
            if(aim_up_y > -1 && board.slots[aim_up_y + ',' + slot_x] instanceof PlayableSlot){
                aim.push(aim_up_y + ',' + slot_x); 
            }
            if(aim_down_y > -1 && board.slots[aim_down_y + ',' + slot_x] instanceof PlayableSlot){
                aim.push(aim_down_y + ',' + slot_x); 
            }

            (board.slots[slot] as PlayableSlot).setInfluencedSlots = {next:next, aim:aim}
        }
        return true;
    }
}