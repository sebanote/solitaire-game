import React from 'react';
import { GenericSlot } from '../../domain/entities/slot';
import { PlayableSlot } from '../../domain/entities/decorators/playableSlotDecorator';
import styles from '../styles/GameBoard.module.scss'; // Import SCSS module

interface GameBoardProps {
  slots: Record<string, GenericSlot | PlayableSlot>;
  rows: number;
  cols: number;
  onSlotClick: (row: number, col: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ slots, rows, cols, onSlotClick }) => {
  return (
    <div className={styles['game-board']} style={{ gridTemplateColumns: `repeat(${cols}, 50px)` }}>
      {Array.from({ length: rows }).map((_, rowIndex) =>
        Array.from({ length: cols }).map((_, colIndex) => {
          const slotKey = `${rowIndex},${colIndex}`;
          const slot = slots[slotKey];

          const baseClass = styles.slot;
          const playableClass = slot instanceof PlayableSlot
            ? slot.isTaken()
              ? styles['slot-taken']
              : styles['slot-available']
            : '';

          return (
            <div
              key={slotKey}
              onClick={() => onSlotClick(rowIndex, colIndex)}
              className={`${baseClass} ${playableClass}`}
              role='button'
            >
              {slot instanceof PlayableSlot ? (slot.isTaken() ? '●' : '○') : ''}
            </div>
          );
        })
      )}
    </div>
  );
};

export default GameBoard;