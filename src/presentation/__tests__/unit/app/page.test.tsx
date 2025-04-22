import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../src/app/page';
import { MakeMove } from '../../../../domain/use-cases/make-move';


const mockSlots = {
    '1,3': { taken: true, id: '1,3' },
    '3,3': { taken: false, id: '3,3' },
};

jest.mock('../../../../domain/use-cases/init-game', () => {
    return {
      InitGame: jest.fn().mockImplementation(() => {
        return {
          setBoard: jest.fn(),
          fillInfluencedSlots: jest.fn(),
          game: {
            getBoard: { slots: mockSlots },
            getPins: () => 32,
            possibleMoves: 10,
          },
        };
      }),
    };
});

jest.mock('../../../../domain/use-cases/update-game', () => {
    return {
      UpdateGame: jest.fn().mockImplementation((game) => {
        return {
          updateTheGame: () => {
            game.getBoard.slots['1,3'].taken = false;
            game.getBoard.slots['3,3'].taken = true;
            return true;
          },
          updateAvailableMoves: jest.fn(),
          updatePossibleMoves: jest.fn().mockReturnValue(8),
        };
      }),
    };
  });

jest.mock('../../../../domain/use-cases/make-move', () => {
    return {
        MakeMove: jest.fn().mockImplementation(() => ({
          isMoveAllowed: jest.fn(),
          findMidSlot: jest.fn(),
          performMove: jest.fn(),
        }))
    }
});

// Define types for the props
type SlotsType = Record<string, { taken: boolean; id: string }>;
type OnSlotClickType = (row: number, col: number) => void;

jest.mock('../../../src/components/GameBoard', () => ({
    __esModule: true,
    default: ({ slots, onSlotClick }: { slots: SlotsType; onSlotClick: OnSlotClickType }) => (
        <div data-testid="game-board">
            {Object.keys(slots).map((key) => (
                <div key={key} data-testid={`slot-${key}`} onClick={() => onSlotClick(...(key.split(',').map(Number) as [number, number]))}></div>
            ))}
        </div>
    ),
}));

globalThis.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
              text: 'Mocked AI response',
              arrangements: [
                    [null, null, true, true, true, null, null],
                    [null, null, true, true, true, null, null],
                    [true, true, true, true, true, true, true],
                    [true, true, true, false, true, true, true],
                    [true, true, true, true, true, true, true],
                    [null, null, true, true, true, null, null],
                    [null, null, true, true, true, null, null],
                ],
              id: null
            }),
    })
) as jest.Mock;

describe('Home Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state initially', async () => {
        render(<Home />);

        await waitFor(() => expect(screen.getByText(/Generating new level.../i)).toBeInTheDocument());
    });

    test('renders game board after initialization', async () => {
        render(<Home />);
        await waitFor(() => expect(screen.getByTestId('game-board')).toBeInTheDocument());
        expect(screen.getByText(/Pins Left:/i)).toBeInTheDocument();
        expect(screen.getByText(/Possible Moves:/i)).toBeInTheDocument();
        expect(screen.getByText(/Game Status:/i)).toBeInTheDocument();
    });

    test('handles slot clicks correctly', async () => {

        render(<Home />);
        await waitFor(() => expect(screen.getByTestId('game-board')).toBeInTheDocument());
        
        const slot13 = screen.getByTestId('slot-1,3');
        const slot33 = screen.getByTestId('slot-3,3');

        expect(mockSlots['1,3'].taken).toBe(true);
        expect(mockSlots['3,3'].taken).toBe(false);

        // Simulate clicks
        fireEvent.click(slot13);
        fireEvent.click(slot33);

        await waitFor(() => {
          expect(mockSlots['1,3'].taken).toBe(false);
          expect(mockSlots['3,3'].taken).toBe(true);

          // Verify MakeMove instantiation
          expect(MakeMove).toHaveBeenCalled();
        });
    });

    test('displays "Game Over!" when finished', async () => {
        render(<Home />);
        await waitFor(() => expect(screen.getByTestId('game-board')).toBeInTheDocument());

        // Simulate game over state
        fireEvent.click(screen.getByTestId('slot-1,3'));
        fireEvent.click(screen.getByTestId('slot-3,3'));

        await waitFor(() => expect(screen.getByText(/Game Over!/i)).toBeInTheDocument());
    });

});