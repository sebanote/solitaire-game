import { Slots } from '../interfaces/interfaces'

export class PlayableSlot implements Slots {
    constructor(x: number, y: number){
        this.position_x = x;
        this.position_y = y;
    }

    position_x: number;
    position_y: number;
    private isEmpty: boolean = true;


    get getSlotPositionX() {
        return this.position_x
    };

    get getSlotPositionY() {
        return this.position_y
    };

    get isEmptyStatus() {
        return this.isEmpty;
    }

    set setFull(status: boolean) {
        this.isEmpty = status;
    }
}

export class notPlayableSlot implements Slots {
    constructor(x: number, y: number){
        this.position_x = x;
        this.position_y = y;
    }

    position_x: number;
    position_y: number;

    get getSlotPositionX() {
        return this.position_x
    };

    get getSlotPositionY() {
        return this.position_y
    };
}

