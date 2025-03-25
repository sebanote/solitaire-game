import { GenericSlot } from "../entities/slot";
import { SlotDecorator } from "./slotDecorator";

export class PlayableSlot extends SlotDecorator {

    constructor(protected slot: GenericSlot, taken?: boolean){
        super(slot);

        if(taken)
            this.taken = taken;
    }

    get positionX(): number {
        return super.position_x;
    }

    get positionY(): number {
        return super.position_y;
    }

    protected taken: boolean = false;

    get isTaken() {
        return this.taken;
    }

    setTaken(taken: boolean) {
        this.taken = taken;
    }
}