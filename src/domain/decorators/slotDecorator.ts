import { Slot } from '../entities/slot';

export abstract class SlotDecorator implements Slot {
    constructor(protected slot: Slot) {};


    get position_x(): number {
        return this.slot.position_x;
    }

    get position_y(): number {
        return this.slot.position_y;
    }
}