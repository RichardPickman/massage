import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AdminService from '../../services/Admin';
import { ApiError } from '../../services/errors';
import { makeStore, renderWithProviders } from '../../test/helpers';
import { Admin } from '.';

const code = 'ABCD-1234-EF56-7890';

const stubClipboard = () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
    });

    return writeText;
};

const mintCode = async (email: string) => {
    await userEvent.type(screen.getByLabelText('Their email'), email);
    await userEvent.click(screen.getByRole('button', { name: 'Get the code' }));
};

describe('Admin invite panel', () => {
    beforeEach(() => {
        stubClipboard();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('mints the code for the address and copies it on one click', async () => {
        const writeText = stubClipboard();

        vi.spyOn(AdminService, 'invite').mockResolvedValue({
            email: 'friend@example.com',
            code,
        });

        renderWithProviders(<Admin />, { store: makeStore() });

        await mintCode('friend@example.com');

        expect(await screen.findByText(code)).toBeInTheDocument();
        expect(AdminService.invite).toHaveBeenCalledWith('friend@example.com');

        await userEvent.click(
            screen.getByRole('button', { name: 'Copy the code' })
        );

        // The label is the confirmation: no toast to sit on top of the page.
        expect(
            await screen.findByRole('button', { name: 'Copied' })
        ).toBeInTheDocument();
        expect(writeText).toHaveBeenCalledWith(code);
    });

    it('shows the refusal instead of a code when the server says no', async () => {
        vi.spyOn(AdminService, 'invite').mockRejectedValue(
            new ApiError(403, 'Not authorized')
        );

        renderWithProviders(<Admin />, { store: makeStore() });

        await mintCode('friend@example.com');

        expect(await screen.findByText('Not authorized')).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'Copy the code' })
        ).not.toBeInTheDocument();
    });
});
