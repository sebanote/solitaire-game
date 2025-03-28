import { SetGame } from "./set-game";

// const classicArrangement = [
//     [null, null, null, true, true, true, null, null, null],
//     [null, null, null, true, true, true, null, null, null],
//     [null, null, null, true, true, true, null, null, null],
//     [true, true, true, true, true, true, true, true, true],
//     [true, true, true, true, false, true, true, true, true],
//     [true, true, true, true, true, true, true, true, true],
//     [null, null, null, true, true, true, null, null, null],
//     [null, null, null, true, true, true, null, null, null],
//     [null, null, null, true, true, true, null, null, null]
// ]

const smallArrangement = [
    [null,true,null],
    [null,true,null],
    [false,true,null],
]

//const nullArrangement = [[]]


while(true){

    const game = new SetGame(3,3,smallArrangement)

    //const gameReady = game.setBoard()

    console.log(game.getBoard())

    break;

}