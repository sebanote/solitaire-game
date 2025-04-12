import { Board } from '../entities/board';
import { PlayableSlot } from '../entities/decorators/playableSlotDecorator';
import { GenericSlot } from '../entities/slot';
import { Game } from '../entities/game';

export class InitGame {

    constructor(private width: number, private height: number, private arrangement: Array<Array<null | boolean>>){
        this._game = new Game(new Board(this.width, this.height));
    }

    private _game: Game;

    setBoard(): boolean {
        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++){
                const index = y + "," + x;
                if(this.arrangement[y][x] != null){
                    (this._game.getBoard).slots[index] = new PlayableSlot(new GenericSlot(x,y), this.arrangement[y][x] as boolean);
                    if(this.arrangement[y][x])
                        this._game.setPins = this._game.getPins + 1;
                }
                else
                    this._game.getBoard.slots[index] = new GenericSlot(x,y);
            }
        }
        return true;
    }

    get game() {
        return this._game;
    }

    fillInfluencedSlots(): boolean {

        const slots = Object.keys(this._game.getBoard.slots)

        const max_x = this._game.getBoard.getWidth - 1;
        const max_y = this._game.getBoard.getHeight - 1;

        for(const slot of slots){

            const board = this._game.getBoard;

            const influenced: Array<string[]> = [[],[],[],[]]

            const slotPosition = slot.split(',')

            const slot_x = +slotPosition[1]
            const slot_y = +slotPosition[0]

            const next_left_x = slot_x - 1 >= 0 ? slot_x - 1 : -1;
            const next_right_x = slot_x + 1 <= max_x ? slot_x + 1 : -1;
            const next_up_y = slot_y - 1 >= 0 ? slot_y - 1 : -1;
            const next_down_y = slot_y + 1 <= max_y ? slot_y + 1 : -1;

            const aim_left_x = slot_x - 2 >= 0 ? slot_x - 2 : -1;
            const aim_right_x = slot_x + 2 <= max_x ? slot_x + 2 : -1;
            const aim_up_y = slot_y - 2 >= 0 ? slot_y - 2 : -1;
            const aim_down_y = slot_y + 2 <= max_y ? slot_y + 2 : -1;

            if(next_left_x > -1 && board.slots[slot_y + ',' + next_left_x] instanceof PlayableSlot){
                influenced[0][0] = slot_y + ',' + next_left_x
            }
            if(next_right_x > -1 && board.slots[slot_y + ',' + next_right_x] instanceof PlayableSlot){
                influenced[1][0] = slot_y + ',' + next_right_x
            }
            if(next_up_y > -1 && board.slots[next_up_y + ',' + slot_x] instanceof PlayableSlot){
                influenced[2][0] = next_up_y + ',' + slot_x
            }
            if(next_down_y > -1 && board.slots[next_down_y + ',' + slot_x] instanceof PlayableSlot){
                influenced[3][0] = next_down_y + ',' + slot_x
            }

            if(aim_left_x > -1 && board.slots[slot_y + ',' + aim_left_x] instanceof PlayableSlot){
                influenced[0][1] = slot_y + ',' + aim_left_x
            }
            if(aim_right_x > -1 && board.slots[slot_y + ',' + aim_right_x] instanceof PlayableSlot){
                influenced[1][1] = slot_y + ',' + aim_right_x
            }
            if(aim_up_y > -1 && board.slots[aim_up_y + ',' + slot_x] instanceof PlayableSlot){
                influenced[2][1] = aim_up_y + ',' + slot_x
            }
            if(aim_down_y > -1 && board.slots[aim_down_y + ',' + slot_x] instanceof PlayableSlot){
                influenced[3][1] = aim_down_y + ',' + slot_x
            }

            if (board.slots[slot] instanceof PlayableSlot) {
                (board.slots[slot] as PlayableSlot).setInfluencedSlots = influenced;
            }
        }
        return true;
    }
}