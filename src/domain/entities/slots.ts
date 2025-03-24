export class Slots {

    constructor(x: number, y: number){
        this.position_x = x;
        this.position_y = y;
    }

    protected position_x : number;
    protected position_y : number;

    get getSlotPositionX() {
        return this.position_x;
    };

    get getSlotPositionY() {
        return this.position_y;
    };
}

export class PlayableSlot extends Slots {
    constructor(x: number, y: number){
        super(x, y);
        this.isEmpty = true;
    }

    private isEmpty: boolean;

    get isEmptyStatus() {
        return this.isEmpty;
    }

    set setFull(status: boolean) {
        this.isEmpty = status;
    }
}


