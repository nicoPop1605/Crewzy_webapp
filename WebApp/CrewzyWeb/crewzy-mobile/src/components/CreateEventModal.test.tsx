import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateEventModal } from './CreateEventModal';

describe('CreateEventModal Validation', () => {
    const mockOnCreate = vi.fn();
    const mockOnClose = vi.fn();

    // Clear the mock function history before every test so they don't interfere with each other
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show validation errors when submitting an empty form', () => {
        render(<CreateEventModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} groups={[]} />);

        const submitButton = screen.getByRole('button', { name: 'Create Event' });
        fireEvent.click(submitButton);

        // Check for empty field errors
        expect(screen.getByText('Event title is required')).toBeInTheDocument();
        expect(screen.getByText('Date is required')).toBeInTheDocument();
        expect(screen.getByText('Time is required')).toBeInTheDocument();
        expect(screen.getByText('Location is required')).toBeInTheDocument(); // New check!

        expect(mockOnCreate).not.toHaveBeenCalled();
    });

    it('should reject dates in the past', () => {
        render(<CreateEventModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} groups={[]} />);

        // Find the date input (React Testing Library can find it by its label or type, but here we'll use placeholder/label logic implicitly if needed, or by Test ID. The easiest way is using the label)
        // Since the label has an SVG inside it, getByLabelText might be tricky. Let's use getByDisplayValue or just query the DOM.
        // Actually, the easiest way is to get the input by its type attribute:

        // Simpler approach for React Testing Library: 
        // Let's grab the inputs by their type or placeholder since they are unique enough
        const titleInput = screen.getByPlaceholderText('Enter event title...');
        const dateInputs = document.querySelectorAll('input[type="date"]');
        const pastDateInput = dateInputs[0];

        // Fill out just the title and a past date
        fireEvent.change(titleInput, { target: { value: 'My Awesome Event' } });
        fireEvent.change(pastDateInput, { target: { value: '2000-01-01' } }); // A date way in the past

        const submitButton = screen.getByRole('button', { name: 'Create Event' });
        fireEvent.click(submitButton);

        // Verify the specific date error appears
        expect(screen.getByText('Date cannot be in the past')).toBeInTheDocument();
        expect(mockOnCreate).not.toHaveBeenCalled();
    });

    it('should reject invalid URLs when Location Type is "Link"', () => {
        render(<CreateEventModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} groups={[]} />);

        // Click the "Event Link" button to change the location type
        const linkModeButton = screen.getByText('Event Link');
        fireEvent.click(linkModeButton);

        // Find the location input (placeholder changes when in link mode)
        const locationInput = screen.getByPlaceholderText('Paste event link from Discover...');

        // Type a bad URL
        fireEvent.change(locationInput, { target: { value: 'not-a-real-url' } });

        const submitButton = screen.getByRole('button', { name: 'Create Event' });
        fireEvent.click(submitButton);

        // Verify the URL validation triggers
        expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument();
        expect(mockOnCreate).not.toHaveBeenCalled();
    });

    it('should submit successfully when all data is valid (Happy Path)', () => {
        render(<CreateEventModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} groups={[]} />);

        // Get inputs
        const titleInput = screen.getByPlaceholderText('Enter event title...');
        const dateInput = document.querySelectorAll('input[type="date"]')[0];
        const timeInput = document.querySelectorAll('input[type="time"]')[0];
        const locationInput = screen.getByPlaceholderText('Enter location...');

        // Fill out the form with valid future data
        fireEvent.change(titleInput, { target: { value: 'My Valid Event' } });
        fireEvent.change(dateInput, { target: { value: '2030-12-31' } }); // Safely in the future
        fireEvent.change(timeInput, { target: { value: '14:00' } });
        fireEvent.change(locationInput, { target: { value: 'Central Park' } });

        const submitButton = screen.getByRole('button', { name: 'Create Event' });
        fireEvent.click(submitButton);

        // Verify that NO error messages exist on the screen
        expect(screen.queryByText('Event title is required')).toBeNull();
        expect(screen.queryByText('Date cannot be in the past')).toBeNull();

        // Verify that onCreate was actually called exactly once!
        expect(mockOnCreate).toHaveBeenCalledTimes(1);

        // Verify it was called with the correct data structure
        expect(mockOnCreate).toHaveBeenCalledWith(expect.objectContaining({
            title: 'My Valid Event',
            date: '2030-12-31',
            location: 'Central Park'
        }));
    });
});