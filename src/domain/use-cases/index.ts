import { Move } from "../entities/move";
import { InitGame } from "./init-game";
import { MakeMove } from "./make-move";
import { UpdateGame } from "./update-game";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// const classicArrangement = [
//     [null, null, true, true, true, null, null],
//     [null, null, true, true, true, null, null],
//     [true, true, true, true, true, true, true],
//     [true, true, true, false, true, true, true],
//     [true, true, true, true, true, true, true],
//     [null, null, true, true, true, null, null],
//     [null, null, true, true, true, null, null],
// ]

const smallArrangement = [
    [null,true,null],
    [null,true,null],
    [false,false,null],
]

//const nullArrangement = [[]]

const newGame = new InitGame(3,3,smallArrangement)
newGame.setBoard()
newGame.fillInfluencedSlots()

const defaultMove = new MakeMove(new Move('0,0','0,0'), newGame.game.getBoard)
const updateGame = new UpdateGame(newGame.game, defaultMove)
updateGame.updateAvailableMoves()
updateGame.updatePossibleMoves()

const game = async () => {

    while(true){
        let moveFrom: string = ''
        let moveTo: string = ''

        const rl = readline.createInterface({ input, output });
        moveFrom = await rl.question('Insert your move-from...\n');
        moveTo = await rl.question('Insert your move-to...\n');
        rl.close();


        const newUpdate = new UpdateGame(newGame.game, new MakeMove(new Move(moveFrom, moveTo), newGame.game.getBoard));
        const updatedGame = newUpdate.updateTheGame()

        console.table(updatedGame)
        console.log('Possible moves: ', newGame.game.possibleMoves)

        if(newUpdate.isGameFinished()) {
            console.log('Game over.')
            console.log('Pins: ', newGame.game.getPins)
            break;
        }
           
    }
}

game()


