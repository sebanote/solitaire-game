import { Board } from "../entities/board";


while(true){

    const myBoard = new Board(9,9,[
        null,null,null,true,true,true,null,null,null,
        null,null,null,true,true,true,null,null,null,
        null,null,null,true,true,true,null,null,null,
        true,true,true,true,true,true,true,true,true,
        true,true,true,true,false,true,true,true,true,
        true,true,true,true,true,true,true,true,true,
        null,null,null,true,true,true,null,null,null,
        null,null,null,true,true,true,null,null,null,
        null,null,null,true,true,true,null,null,null,
    ])

    console.log(myBoard)

    break;

}