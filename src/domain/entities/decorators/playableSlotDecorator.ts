import { GenericSlot } from "../slot";
import { SlotDecorator } from "./slotDecorator";

export class PlayableSlot extends SlotDecorator {

    constructor(protected slot: GenericSlot, protected taken: boolean){
        super(slot);
        if(taken)
            this.taken = taken;
    }
    
    protected availableMoves: string[] = []
    protected influencedSlots: Array<string[]> = [[],[],[],[]]

    get positionX(): number {
        return this.slot.position_x;
    }

    get positionY(): number {
        return this.slot.position_y;
    }

    isTaken() {
        return this.taken;
    }

    setTaken(taken: boolean) {
        this.taken = taken;
    }

    getAvailableMoves() {
        return this.availableMoves;
    }

    setAvailableMoves(moves: string[]) {
        this.availableMoves = moves;
    }

    get getInfluencedSlots() {
        return this.influencedSlots;
    }

    set setInfluencedSlots(slots: Array<string[]>){
        this.influencedSlots = slots;
    }
}