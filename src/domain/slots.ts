export class Slot {
    constructor(x: number, y: number){
        this.position_x = x;
        this.position_y = y;
    }

    position_x: number;
    position_y: number;
    isEmpty: boolean = true;


    getSlotPositionX() {
        return this.position_x
    };

    getSlotPositionY() {
        return this.position_y
    };

    setFull() {
        this.isEmpty = false;
    }
    
}

