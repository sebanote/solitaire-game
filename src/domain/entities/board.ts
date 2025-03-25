import { Slots, PlayableSlot } from "./slots";

export class Board {

    constructor(width: number, height: number, arrangement?: Array<null | boolean>){
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                const newSlot = new Slots(x,y);
                this.slots.push(newSlot)
            }
        }

        if(arrangement){
            for(const slot of this.slots){
                const index = this.slots.indexOf(slot);
                if(arrangement[index] != null){
                    console.log(slot)
                    const newPlayableSlot = new PlayableSlot(slot.getSlotPositionX,slot.getSlotPositionY);
                    newPlayableSlot.setFull = arrangement[index];
                    this.slots[index] = newPlayableSlot
                }
            }
        }
    }
    
    slots: Array<Slots> = [];

}