import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../app/page';
import { InitGame } from '../../../../domain/use-cases/init-game';
import { UpdateGame } from '../../../../domain/use-cases/update-game';

jest.mock('../../../components/GameBoard', () => {
    return jest.fn(({ onSlotClick }) => (
        <div data-testid="game-board">
            <div
                data-testid="slot-1-3"
                onClick={() => onSlotClick(1, 3)} // Simulate first slot click
            />
            <div
                data-testid="slot-3-3"
                onClick={() => onSlotClick(3, 3)} // Simulate second slot click
            />
        </div>
    ));
});
jest.mock('../../../../domain/use-cases/init-game', () => {
    return {
        InitGame: jest.fn().mockImplementation(() => {
            return {
                    getBoard: { slots: {} },
                    getPins: 32,
                    possibleMoves: 10,
            }
        })
    }
});
jest.mock('../../../../domain/use-cases/update-game');
jest.mock('../../../../domain/use-cases/make-move');
jest.mock('../../../../domain/entities/move');

describe('Home Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the Solitaire Game title and initial state', () => {
        const mockSetBoard = jest.fn();
        const mockFillInfluencedSlots = jest.fn();

        (InitGame as jest.Mock).mockImplementation(() => ({
            setBoard: mockSetBoard,
            fillInfluencedSlots: mockFillInfluencedSlots,
            game: {
                getBoard: { slots: {} },
                getPins: 32,
                possibleMoves: 10,
            },
        }));

        render(<Home />);

        expect(screen.getByText('Solitaire Game')).toBeInTheDocument();
        expect(screen.getByText(/Pins Left:/)).toBeInTheDocument();
        expect(screen.getByText(/Possible Moves:/)).toBeInTheDocument();
        expect(screen.getByTestId('game-board')).toBeInTheDocument();
    });

    test('initializes the game on mount', () => {
        const mockSetBoard = jest.fn();
        const mockFillInfluencedSlots = jest.fn();
        const mockUpdateAvailableMoves = jest.fn();
        const mockUpdatePossibleMoves = jest.fn();

        (InitGame as jest.Mock).mockImplementation(() => ({
            setBoard: mockSetBoard,
            fillInfluencedSlots: mockFillInfluencedSlots,
            game: {
                getBoard: { slots: {} },
                getPins: 32,
                possibleMoves: 10,
            },
        }));

        (UpdateGame as jest.Mock).mockImplementation(() => ({
            updateAvailableMoves: mockUpdateAvailableMoves,
            updatePossibleMoves: mockUpdatePossibleMoves
        }));

        render(<Home />);

        expect(InitGame).toHaveBeenCalledWith(7, 7, expect.any(Array));
        expect(mockSetBoard).toHaveBeenCalled();
        expect(mockFillInfluencedSlots).toHaveBeenCalled();
        expect(mockUpdateAvailableMoves).toHaveBeenCalled();
    });

    test('handles slot clicks correctly', () => {
        const mockUpdateTheGame = jest.fn();
        const mockUpdateAvailableMoves = jest.fn();
        const mockFillInfluencedSlots = jest.fn();
        const mockUpdatePossibleMoves =  jest.fn();
    
        (InitGame as jest.Mock).mockImplementation(() => ({
            setBoard: jest.fn(),
            fillInfluencedSlots: mockFillInfluencedSlots,
            game: {
                getBoard: { slots: {} },
                getPins: 32,
                possibleMoves: 10,
            },
        }));
    
        (UpdateGame as jest.Mock).mockImplementation(() => ({
            updateTheGame: mockUpdateTheGame,
            updateAvailableMoves: mockUpdateAvailableMoves,
            updatePossibleMoves: mockUpdatePossibleMoves,
        }));
    
        render(<Home />);
    
        // Simulate clicks on the mocked GameBoard
        const slot1 = screen.getByTestId('slot-1-3');
        const slot2 = screen.getByTestId('slot-3-3');
    
        fireEvent.click(slot1); // Simulate first click
        fireEvent.click(slot2); // Simulate second click

        expect(mockUpdateTheGame).toHaveBeenCalledTimes(1);
    });
});