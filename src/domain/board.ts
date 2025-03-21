import { Slot } from "./slots";

export class Board {

    constructor(slots: number){
        for(let i = 0; i < slots; i++){
            const newSlot = new Slot(0,0)

            this.slots.push(newSlot)
        }
    }
    slots: Array<Slot> = [];
}