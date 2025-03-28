import { GenericSlot } from "./slot";
import { PlayableSlot } from "./decorators/playableSlotDecorator";

export class Board {

    constructor(protected width: number, protected height: number){
        if(width <= 0 || height <= 0)
            throw new Error("Not acceptable value for board size");
    }
    
    slots: Record<string, PlayableSlot | GenericSlot> = {};

    get getWidth(){
        return this.width;
    }

    get getHeight(){
        return this.height;
    }
}