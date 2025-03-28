export class Move {
    constructor(readonly movingFrom: string = '0,0', readonly movingTo: string = '0,0'){
        if (!movingFrom || !movingTo) {
            throw new Error("Invalid move positions");
        }
    }
}