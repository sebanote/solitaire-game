import { GenericSlot } from "./slot";
import { PlayableSlot } from "../decorators/playableSlotDecorator";

export class Board {

    constructor(width: number, height: number, arrangement?: Array<null | boolean>){
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                const key = x + "," + y;
                const newSlot = new GenericSlot(x,y);
                this.slots[key] = newSlot;
            }
        }

        if(arrangement){
            const keys = Object.keys(this.slots);

            for(const item of arrangement){
                if(item != null){
                    const index = arrangement.indexOf(item);
                    const key = keys[index];
                    this.slots[key] = new PlayableSlot(this.slots[key], item)
                }
            }
        }
    }
    
    slots: Record<string, PlayableSlot | GenericSlot> = {};

}