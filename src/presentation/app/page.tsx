'use client';

import React, { useEffect, useState, useRef } from 'react';
import GameBoard from '../components/GameBoard';
import { InitGame } from '../../domain/use-cases/init-game';
import { MakeMove } from '../../domain/use-cases/make-move';
import { UpdateGame } from '../../domain/use-cases/update-game';
import { Move } from '../../domain/entities/move';
import { GenericSlot } from '../../domain/entities/slot';
import { PlayableSlot } from '../../domain/entities/decorators/playableSlotDecorator';

export default function Home() {
  const [slots, setSlots] = useState<Record<string, GenericSlot | PlayableSlot>>({});
  const [pins, setPins] = useState<number>(0);
  const [possibleMoves, setPossibleMoves] = useState<number>(0);
  const [moveFrom, setMoveFrom] = useState<string | null>(null); // Track the first click

  // Use `useRef` to persist the game instance across renders
  const gameRef = useRef<InitGame | null>(null);
  const updateGameRef = useRef<UpdateGame | null>(null);

  useEffect(() => {
    // Initialize the game only once
    const classicArrangement = [
      [null, null, true, true, true, null, null],
      [null, null, true, true, true, null, null],
      [true, true, true, true, true, true, true],
      [true, true, true, false, true, true, true],
      [true, true, true, true, true, true, true],
      [null, null, true, true, true, null, null],
      [null, null, true, true, true, null, null],
    ];

    const newGame = new InitGame(7, 7, classicArrangement);
    newGame.setBoard();
    newGame.fillInfluencedSlots();

    const defaultMove = new MakeMove(new Move('0,0', '0,0'), newGame.game.getBoard);
    const updateGame = new UpdateGame(newGame.game, defaultMove);
    updateGame.updateAvailableMoves();

    // Store the game instance in `useRef`
    gameRef.current = newGame;
    updateGameRef.current = updateGame;

    // Set the initial state
    setSlots(newGame.game.getBoard.slots);
    setPins(newGame.game.getPins);
    setPossibleMoves(updateGame.updatePossibleMoves());
  }, []);

  const handleSlotClick = (row: number, col: number) => {
    const slotKey = `${row},${col}`;
    console.log(`Slot clicked: ${slotKey}`);

    if (!moveFrom) {
      // First click: Save moveFrom coordinates
      setMoveFrom(slotKey);
      console.log(`Move From set to: ${slotKey}`);
    } else {
      // Second click: Save moveTo coordinates and perform the move
      const moveTo = slotKey;
      console.log(`Move To set to: ${moveTo}`);

      if (gameRef.current && updateGameRef.current) {
        const newUpdate = new UpdateGame(
          gameRef.current.game,
          new MakeMove(new Move(moveFrom, moveTo), gameRef.current.game.getBoard)
        );

        const updatedGame = newUpdate.updateTheGame();
        setSlots(gameRef.current.game.getBoard.slots); // Update the slots state
        setPins(gameRef.current.game.getPins); // Update the pins count
        setPossibleMoves(gameRef.current.game.possibleMoves); // Update possible moves

        console.log('Updated Game:', updatedGame);

        // Reset moveFrom for the next move
        setMoveFrom(null);
      }
    }
  };

  return (
    <div>
      <h1>Solitaire Game</h1>
      <p>Pins Left: {pins}</p>
      <p>Possible Moves: {possibleMoves}</p>
      <GameBoard slots={slots} rows={7} cols={7} onSlotClick={handleSlotClick}  />
    </div>
  );
}