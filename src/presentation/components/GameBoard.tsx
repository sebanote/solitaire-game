import React from 'react';
import { GenericSlot } from '../../domain/entities/slot';
import { PlayableSlot } from '../../domain/entities/decorators/playableSlotDecorator';

interface GameBoardProps {
  slots: Record<string, GenericSlot | PlayableSlot>;
  rows: number;
  cols: number;
  onSlotClick: (row: number, col: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ slots, rows, cols, onSlotClick }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 50px)` }}>
      {Array.from({ length: rows }).map((_, rowIndex) =>
        Array.from({ length: cols }).map((_, colIndex) => {
          const slotKey = `${rowIndex},${colIndex}`;
          const slot = slots[slotKey];

          return (
            <div
              key={slotKey}
              onClick={() => onSlotClick(rowIndex, colIndex)}
              style={{
                width: '50px',
                height: '50px',
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: slot instanceof PlayableSlot
                  ? slot.isTaken()
                    ? 'green'
                    : 'red'
                  : 'white',
                cursor: slot instanceof PlayableSlot ? 'pointer' : 'default',
                
              }}
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