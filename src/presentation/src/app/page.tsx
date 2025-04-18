'use client';

import React, { useEffect, useState, useRef } from 'react';
import GameBoard from '../components/GameBoard';
import { InitGame } from '../../../domain/use-cases/init-game';
import { MakeMove } from '../../../domain/use-cases/make-move';
import { UpdateGame } from '../../../domain/use-cases/update-game';
import { Move } from '../../../domain/entities/move';
import { GenericSlot } from '../../../domain/entities/slot';
import { PlayableSlot } from '../../../domain/entities/decorators/playableSlotDecorator';

export default function Home() {
  const [slots, setSlots] = useState<Record<string, GenericSlot | PlayableSlot>>({});
  const [pins, setPins] = useState<number>(0);
  const [possibleMoves, setPossibleMoves] = useState<number>(0);
  const [moveFrom, setMoveFrom] = useState<string | null>(null); // Track the first click
  const [finished, setFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Use `useRef` to persist the game instance across renders
  const gameRef = useRef<InitGame | null>(null);
  const updateGameRef = useRef<UpdateGame | null>(null);

  useEffect(() => {
    const initializeGame = async () => {
      setLoading(true);
      try{
        const res = await fetch('http://localhost:3001/api/generate-level');
        let arrangement = await res.json();

        if(arrangement.error)
          arrangement = [
            [null, null, true, true, true, null, null],
            [null, null, true, true, true, null, null],
            [true, true, true, true, true, true, true],
            [true, true, true, false, true, true, true],
            [true, true, true, true, true, true, true],
            [null, null, true, true, true, null, null],
            [null, null, true, true, true, null, null],
          ];

        const newGame = new InitGame(7, 7, arrangement);
        newGame.setBoard();
        newGame.fillInfluencedSlots();

        const defaultMove = new MakeMove(new Move('0,0', '0,0'), newGame.game.getBoard);
        const updateGame = new UpdateGame(newGame.game, defaultMove);
        updateGame.updateAvailableMoves();

        gameRef.current = newGame;
        updateGameRef.current = updateGame;

        setSlots(newGame.game.getBoard.slots);
        setPins(newGame.game.getPins);
        setPossibleMoves(updateGame.updatePossibleMoves());
      }
      catch(e){
        console.error('Error initializing game', e);
      }
      setLoading(false);
    };
    initializeGame();
  }, []);

  useEffect(() => {
    console.log('Finished state changed:', finished);
  }, [finished]);

  const handleSlotClick = (row: number, col: number) => {
    const slotKey = `${row},${col}`;
    console.log(`Slot clicked: ${slotKey}`);

    if (!moveFrom) {
      setMoveFrom(slotKey);
      console.log(`Move From set to: ${slotKey}`);
    } else {
      const moveTo = slotKey;
      console.log(`Move To set to: ${moveTo}`);

      if (gameRef.current && updateGameRef.current) {
        const newUpdate = new UpdateGame(
          gameRef.current.game,
          new MakeMove(new Move(moveFrom, moveTo), gameRef.current.game.getBoard)
        );

        const updatedGame = newUpdate.updateTheGame();
        console.log('Game update result:', updatedGame);
        
        setSlots({...gameRef.current.game.getBoard.slots}); // Force re-render with new object
        setPins(gameRef.current.game.getPins);
        setPossibleMoves(gameRef.current.game.possibleMoves);
        setFinished(Boolean(updatedGame)); // Ensure boolean conversion

        // Reset moveFrom for the next move
        setMoveFrom(null);
      }
    }
  };

  return (
    <div>
      <h1>Solitaire Game</h1>
      {loading ? (
        <p>Generating new level...</p>
      ) : (
        <>
          <p>Pins Left: {pins}</p>
          <p>Possible Moves: {possibleMoves}</p>
          <h2>Game Status: {finished ? "Game Over!" : "Game In Progress"}</h2>
          <GameBoard slots={slots} rows={7} cols={7} onSlotClick={handleSlotClick} />
        </>
      )}
    </div>
  );
}