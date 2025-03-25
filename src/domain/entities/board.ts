import { GenericSlot } from "./slot";
import { PlayableSlot } from "../decorators/playableSlotDecorator";

export class Board {

    constructor(width: number, height: number, arrangement?: Array<null | boolean>){
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                const newSlot = new GenericSlot(x,y);
                this.slots.push(newSlot)
            }
        }

        if(arrangement){
            for(const slot of this.slots){
                const index = this.slots.indexOf(slot);
                if(arrangement[index] != null){
                    const newPlayableSlot = new PlayableSlot(slot);
                    newPlayableSlot.setTaken(arrangement[index]);
                    this.slots[index] = newPlayableSlot
                }
            }
        }
    }
    
    slots: Array< PlayableSlot | GenericSlot > = [];

}