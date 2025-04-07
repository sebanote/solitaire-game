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
        this.game.addMove(this.makeMove.getMove);
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
        const slotsInMove = [this.makeMove.getMove.movingFrom, this.makeMove.findMidSlot(), this.makeMove.getMove.movingTo]
        const allInvolvedSlots: string[] = []
        for(const involvedSlot of slotsInMove){
            for(const slotGroup of (this.game.getBoard.slots[involvedSlot] as PlayableSlot).getInfluencedSlots){
                for(const slot of slotGroup){
                    if(!allInvolvedSlots.includes(slot)){
                        allInvolvedSlots.push(slot)
                    }
                }
            }
        }
        return allInvolvedSlots;
    }

    updateTheGame(): boolean[] {
        if(this.makeMove.isMoveAllowed()){
            this.addNewMove()
            this.updateBoard()
            this.removeOnePin()
            this.updateAvailableMoves(this.findAllInvolvedSlots())
            this.game.possibleMoves = this.updatePossibleMoves()
            const boardArrangement = []
            for(const slot of Object.keys(this.game.getBoard.slots)){
                boardArrangement.push((this.game.getBoard.slots[slot] as PlayableSlot).isTaken())
            }
            return boardArrangement
        }
        else return []
    }

    updatePossibleMoves() {
        const slots = Object.keys(this.game.getBoard.slots)
        let possibleMoves = 0

        for(const slot of slots){
            const slotProps = this.game.getBoard.slots[slot]
            if(slotProps instanceof PlayableSlot && slotProps.isTaken()){
                    possibleMoves += slotProps.getAvailableMoves().length
            }
        }

        return possibleMoves
    }

    isGameFinished():boolean{
        if(this.game.possibleMoves == 0){
            return true
        }
        return false
    }
}