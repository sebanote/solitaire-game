import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameBoard from '../../../src/components/GameBoard';
import { PlayableSlot } from '../../../../domain/entities/decorators/playableSlotDecorator';
import { GenericSlot } from '../../../../domain/entities/slot';

jest.mock('../../../../domain/entities/decorators/playableSlotDecorator', () => {
    return{
        PlayableSlot: jest.fn().mockImplementation((slot,taken) => {
            return {
                taken:taken,
                isTaken: jest.fn().mockReturnValue(taken)
            }
        })
    }
});
jest.mock('../../../../domain/entities/slot', () => {
    return {
        GenericSlot: jest.fn().mockImplementation((row, col) => {
            return {
                position_x: col,
                position_y: row
            }
        })
    }
});


jest.mock('../../../src/styles/GameBoard.module.scss', () => (
    {
        'slot': 'slot',
        'slot-taken': 'slot-taken',
        'slot-available': 'slot-available'
    }
));


describe('GameBoard Component', () => {
    const mockOnSlotClick = jest.fn();

    const createMockSlots = (rows: number, cols: number) => {
        const slots: Record<string, GenericSlot | PlayableSlot> = {};
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const key = `${row},${col}`;
                slots[key] = new PlayableSlot(new GenericSlot(row,col),false); // All slots are initially not taken
            }
        }
        return slots;
    };

    test('renders the correct number of slots', () => {
        const rows = 3;
        const cols = 3;
        const slots = createMockSlots(rows, cols);
        const selectedSlot = null;

        render(<GameBoard slots={slots} rows={rows} cols={cols} onSlotClick={mockOnSlotClick} selectedSlot={selectedSlot}/>);

        const slotElements = screen.getAllByRole('button');
        expect(slotElements).toHaveLength(rows * cols);
    });

    test('calls onSlotClick with correct row and column when a slot is clicked', () => {
        const rows = 2;
        const cols = 2;
        const slots = createMockSlots(rows, cols);
        const selectedSlot = null;

        render(<GameBoard slots={slots} rows={rows} cols={cols} onSlotClick={mockOnSlotClick} selectedSlot={selectedSlot}/>);

        const slotElements = screen.getAllByRole('button');
        fireEvent.click(slotElements[0]); // Click the first slot

        expect(mockOnSlotClick).toHaveBeenCalledWith(0, 0);
    });

    test('renders slots with correct background color based on PlayableSlot state', () => {
        const rows = 1;
        const cols = 2;
        const slots: Record<string, GenericSlot | PlayableSlot> = {
            '0,0': new PlayableSlot(new GenericSlot(0, 0), false), // Not taken
            '0,1': new PlayableSlot(new GenericSlot(0, 1), true),  // Taken
        };
        const selectedSlot = null;

        Object.setPrototypeOf(slots['0,0'], PlayableSlot.prototype);
        Object.setPrototypeOf(slots['0,1'], PlayableSlot.prototype);

        

        render(<GameBoard slots={slots} rows={rows} cols={cols} onSlotClick={mockOnSlotClick} selectedSlot={selectedSlot} />);

        const slotElements = screen.getAllByRole('button');

        // Ensure className is correctly assigned
        expect(slotElements[0].className).toContain('slot-available');
        expect(slotElements[1].className).toContain('slot-taken');
    });

    test('renders empty slots with white background if not PlayableSlot', () => {
        const rows = 1;
        const cols = 1;
        const slots: Record<string, GenericSlot | PlayableSlot> = {
            '0,0': new GenericSlot(0,0), // Not a PlayableSlot
        };
        const selectedSlot = null;

        render(<GameBoard slots={slots} rows={rows} cols={cols} onSlotClick={mockOnSlotClick} selectedSlot={selectedSlot}/>);

        const slotElement = screen.getByRole('button');

         // Ensure className is correctly assigned
        expect(slotElement.className).toContain('slot');
        expect(slotElement.className).not.toContain('slot-available'); 
        expect(slotElement.className).not.toContain('slot-taken');  
    });
});