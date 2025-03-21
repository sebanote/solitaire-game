export class Slot {
    constructor(x: number, y: number){
        this.position_x = x;
        this.position_y = y;
    }

    private position_x: number;
    private position_y: number;
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

