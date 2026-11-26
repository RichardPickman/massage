import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AdminService from '../../services/Admin';
import { ApiError } from '../../services/errors';
import { makeStore, renderWithProviders } from '../../test/helpers';
import { Admin } from '.';

const code = 'PRZEMYSLAW-2026-KOD';

const stubClipboard = () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
    });

    return writeText;
};

describe('Admin registration code panel', () => {
    beforeEach(() => {
        stubClipboard();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows the one code for the group and copies it on one click', async () => {
        const writeText = stubClipboard();

        vi.spyOn(AdminService, 'registrationCode').mockResolvedValue({ code });

        renderWithProviders(<Admin />, { store: makeStore() });

        // Nobody is asked whom the code is for: it admits the whole group.
        expect(await screen.findByText(code)).toBeInTheDocument();
        expect(AdminService.registrationCode).toHaveBeenCalledTimes(1);
        expect(screen.queryByLabelText('Their email')).not.toBeInTheDocument();

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
        vi.spyOn(AdminService, 'registrationCode').mockRejectedValue(
            new ApiError(
                500,
                'REGISTRATION_CODE is not set, so nobody can register'
            )
        );

        renderWithProviders(<Admin />, { store: makeStore() });

        expect(
            await screen.findByText(
                'REGISTRATION_CODE is not set, so nobody can register'
            )
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'Copy the code' })
        ).not.toBeInTheDocument();
    });
});
