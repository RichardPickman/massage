import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../components/ui/button';

describe('test harness', () => {
    it('renders into jsdom and dispatches clicks', async () => {
        const onClick = vi.fn();

        render(<Button onClick={onClick}>Save</Button>);

        const button = screen.getByRole('button', { name: 'Save' });

        expect(button).toBeInTheDocument();

        await userEvent.click(button);

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
