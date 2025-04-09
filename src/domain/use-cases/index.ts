import { Move } from "../entities/move";
import { InitGame } from "./init-game";
import { MakeMove } from "./make-move";
import { UpdateGame } from "./update-game";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const classicArrangement = [
    [null, null, true, true, true, null, null],
    [null, null, true, true, true, null, null],
    [true, true, true, true, true, true, true],
    [true, true, true, false, true, true, true],
    [true, true, true, true, true, true, true],
    [null, null, true, true, true, null, null],
    [null, null, true, true, true, null, null],
]

// const smallArrangement = [
//     [null,true,null],
//     [null,true,null],
//     [false,true,null],
// ]

//const nullArrangement = [[]]

const newGame = new InitGame(7,7,classicArrangement)
newGame.setBoard()
newGame.fillInfluencedSlots()

const defaultMove = new MakeMove(new Move('0,0','0,0'), newGame.game.getBoard)
const updateGame = new UpdateGame(newGame.game, defaultMove)
updateGame.updateTheGame()

const game = async () => {

    while(true){

        let moveFrom: string = ''
        let moveTo: string = ''

        const rl = readline.createInterface({ input, output });
        moveFrom = await rl.question('Insert your move-from...\n');
        moveTo = await rl.question('Insert your move-to...\n');
        rl.close();

        const newUpdate = new UpdateGame(newGame.game, new MakeMove(new Move(moveFrom, moveTo), newGame.game.getBoard));
        console.log(newUpdate.updateTheGame());
        if(newUpdate.isGameFinished())
            break
    }
}

game().catch(console.error);


