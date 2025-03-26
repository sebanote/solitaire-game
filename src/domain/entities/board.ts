import { GenericSlot } from "./slot";
import { PlayableSlot } from "../decorators/playableSlotDecorator";

export class Board {

    constructor(width: number, height: number, arrangement?: Array<null | boolean>){
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                const key = y + "," + x;
                const newSlot = new GenericSlot(x,y);
                this.slots[key] = newSlot;
            }
        }

        if(arrangement){
            const keys = Object.keys(this.slots);

            

            for(let i = 0; i < arrangement.length; i++){
                if(arrangement[i] != null){
                    const key = keys[i];
                    this.slots[key] = new PlayableSlot(this.slots[key], arrangement[i] as boolean)
                }
            }
        }
    }
    
    slots: Record<string, PlayableSlot | GenericSlot> = {};

    setAsTaken(slot: PlayableSlot) {
        slot.setTaken(true);
    }

    askIfTaken(slot: PlayableSlot): boolean {
        return slot.isTaken();
    }

}