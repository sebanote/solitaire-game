import { Board } from '../entities/board';
import { PlayableSlot } from '../entities/decorators/playableSlotDecorator';
import { Move } from '../entities/move'
import { GenericSlot } from '../entities/slot';

export class SetGame {

    constructor(private width: number, private height: number, private arrangement: Array<Array<null | boolean>>){}

    private moves: Move[] = [];
    private possibleMoves: number = 100;
    private board: object | Board = {};
    private pins: number = 0

    setBoard(): boolean {
        try{
            this.board = new Board(this.width, this.height);

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

}