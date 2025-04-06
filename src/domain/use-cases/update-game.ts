import { Game } from '../../domain/entities/game'
import { MakeMove } from './make-move';
import { Move } from '../entities/move';
import { PlayableSlot } from '../entities/decorators/playableSlotDecorator';

export class UpdateGame {

    constructor(private game: Game, private makeMove: MakeMove){}

    get getGame(){
        return this.game;
    }

    get getMakeMove(){
        return this.makeMove;
    }

    addNewMove() {
        if(this.makeMove.isMoveAllowed()){
            this.game.addMove(this.makeMove.getMove);
            this.removeOnePin()
            return true;
        }
        return false;
    }

    removeOneMove() {
        return this.game.rollBackMove();
    }

    removeOnePin() {
        this.game.setPins = this.game.getPins - 1;
    }

    restoreOnePin() {
        this.game.setPins = this.game.getPins + 1;
    }

    updateBoard() {
        this.makeMove.performMove(false)
    }

    rollBackBoard() {
        const removed = this.removeOneMove();

        if(removed){
            const backMove = new Move(removed.movingTo, removed.movingFrom)
            const rollBackMove = new MakeMove(backMove, this.game.getBoard)

            rollBackMove.performMove(true)
            this.restoreOnePin();
        }
    }

    updateAvailableMoves(slots?: string[]){

        const slotsToEvaluate = slots ? slots : Object.keys(this.game.getBoard.slots)

        for(const slot of slotsToEvaluate){
            const availableMoves: string[] = [] 
            const influencedSlots = (this.game.getBoard.slots[slot] as PlayableSlot).getInfluencedSlots

            for(const influencedSlot of influencedSlots){
                if(influencedSlot[1]){
                    if((this.game.getBoard.slots[influencedSlot[0]] as PlayableSlot).isTaken() && !(this.game.getBoard.slots[influencedSlot[1]] as PlayableSlot).isTaken()){
                        availableMoves.push(influencedSlot[1])
                    }
                }
            }

            (this.game.getBoard.slots[slot] as PlayableSlot).setAvailableMoves(availableMoves)

        } 
    }

    findAllInvolvedSlots() {
        const allInvolvedSlots = [this.makeMove.getMove.movingFrom, this.getMakeMove.findMidSlot(), this.makeMove.getMove.movingTo]

        for(const involvedSlot of allInvolvedSlots){
            for(const slotGroup of (this.game.getBoard.slots[involvedSlot] as PlayableSlot).getInfluencedSlots){
                for(const slot of slotGroup){
                    allInvolvedSlots.push(slot)
                }
            }
        }
        return allInvolvedSlots;
    }

    updateTheGame(): boolean[] {
        this.addNewMove()
        this.updateBoard()
        this.removeOnePin()

        this.updateAvailableMoves(this.findAllInvolvedSlots())
        
        const boardArrangement = []
        for(const slot of Object.keys(this.game.getBoard.slots)){
            boardArrangement.push((this.game.getBoard.slots[slot] as PlayableSlot).isTaken())
        }
        return boardArrangement
    }
}