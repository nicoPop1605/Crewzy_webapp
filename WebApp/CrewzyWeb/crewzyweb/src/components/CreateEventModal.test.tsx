import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateEventModal } from './CreateEventModal';

describe('CreateEventModal Validation', () => {
    it('should show validation errors when submitting an empty form', () => {
        // 1. Create fake functions to simulate the props
        const mockOnCreate = vi.fn();
        const mockOnClose = vi.fn();

        // 2. Render the Modal in our virtual testing environment
        render(
            <CreateEventModal
                isOpen={true}
                onClose={mockOnClose}
                onCreate={mockOnCreate}
                groups={[]}
            />
        );

        // 3. Find the "Create Event" button and click it
        const submitButton = screen.getByRole('button', { name: 'Create Event' });
        fireEvent.click(submitButton);

        // 4. Check if the error messages appear on the screen
        expect(screen.getByText('Event title is required')).toBeInTheDocument();
        expect(screen.getByText('Date is required')).toBeInTheDocument();
        expect(screen.getByText('Time is required')).toBeInTheDocument();

        // 5. Ensure the onCreate function was NOT called
        expect(mockOnCreate).not.toHaveBeenCalled();
    });
});