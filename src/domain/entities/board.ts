import { PlayableSlot, notPlayableSlot } from "./slots";
import { Slots } from '../interfaces/interfaces'

export class Board {

    constructor(width: number, height: number, arrangement?: Array<null | boolean>){
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                const newSlot = new notPlayableSlot(x,y);
                this.slots.push(newSlot)
            }
        }

        if(arrangement){
            for(const slot of this.slots){
                const index = this.slots.indexOf(slot);
                if(arrangement[index] != null){
                    const newPlayableSlot = new PlayableSlot(slot.position_x,slot.position_y);
                    newPlayableSlot.setFull = arrangement[index];
                    this.slots[index] = newPlayableSlot
                }
            }
        }
    }
    slots: Array<Slots> = [];

}