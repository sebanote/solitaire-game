export interface Slot {

    position_x: number;
    position_y: number;
}

export class GenericSlot implements Slot {
    constructor(public readonly position_x: number, public readonly position_y: number){}
}



