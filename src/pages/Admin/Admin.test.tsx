import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Admin } from '.';
import AdminService from '../../services/Admin';
import { ApiError } from '../../services/errors';
import { makeStore, renderWithProviders } from '../../test/helpers';

const code = 'o84vo4';

const stubClipboard = () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
    });

    return writeText;
};

const users = [
    {
        id: 'u1',
        user: 'Ania',
        email: 'ania@students.local',
        role: 'user' as const,
    },
    {
        id: 'u2',
        user: 'Marek',
        email: 'marek@students.local',
        role: 'admin' as const,
    },
];

const stubUsers = () =>
    vi.spyOn(AdminService, 'users').mockResolvedValue({
        items: users,
        total: 2,
        page: 1,
        pages: 1,
        limit: 25,
    });

describe('Admin panel', () => {
    beforeEach(() => {
        stubClipboard();
        vi.spyOn(AdminService, 'registrationCode').mockResolvedValue({ code });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('opens on the registration code and copies it on one click', async () => {
        const writeText = stubClipboard();

        renderWithProviders(<Admin />, { store: makeStore() });

        expect(await screen.findByText(code)).toBeInTheDocument();
        expect(AdminService.registrationCode).toHaveBeenCalledTimes(1);
        expect(screen.queryByLabelText('Their email')).not.toBeInTheDocument();

        await userEvent.click(
            screen.getByRole('button', { name: 'Copy the code' })
        );

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

    it('switches to the users tab and lists people with their roles', async () => {
        stubUsers();

        renderWithProviders(<Admin />, { store: makeStore() });

        await screen.findByText(code);
        await userEvent.click(screen.getByRole('tab', { name: 'Users' }));

        expect(await screen.findByText('Ania')).toBeInTheDocument();
        expect(screen.getByText('Marek')).toBeInTheDocument();
        // Roles are named for a human, not shown as the raw database value.
        expect(screen.getByText('Student')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('edits a person: nickname, role and an optional password', async () => {
        stubUsers();
        const save = vi
            .spyOn(AdminService, 'updateUser')
            .mockResolvedValue({ ...users[0], role: 'admin' });

        renderWithProviders(<Admin />, { store: makeStore() });

        await userEvent.click(
            await screen.findByRole('tab', { name: 'Users' })
        );
        await userEvent.click(
            await screen.findByRole('button', { name: 'Edit: Ania' })
        );

        const dialog = await screen.findByRole('dialog');
        const nickname = within(dialog).getByLabelText('Nickname');

        await userEvent.clear(nickname);
        await userEvent.type(nickname, 'Ania K');
        await userEvent.click(
            within(dialog).getByRole('button', { name: 'Admin' })
        );
        await userEvent.type(
            within(dialog).getByLabelText('New password (optional)'),
            'a-long-password'
        );
        await userEvent.click(
            within(dialog).getByRole('button', { name: 'Save' })
        );

        expect(save).toHaveBeenCalledWith('u1', {
            user: 'Ania K',
            role: 'admin',
            password: 'a-long-password',
        });
    });

    it('deletes a person only after the confirmation', async () => {
        stubUsers();
        const remove = vi
            .spyOn(AdminService, 'removeUser')
            .mockResolvedValue({ id: 'u1' });

        renderWithProviders(<Admin />, { store: makeStore() });

        await userEvent.click(
            await screen.findByRole('tab', { name: 'Users' })
        );
        await userEvent.click(
            await screen.findByRole('button', { name: 'Delete: Ania' })
        );

        expect(remove).not.toHaveBeenCalled();

        const dialog = await screen.findByRole('dialog');

        await userEvent.click(
            within(dialog).getByRole('button', { name: 'Remove the account' })
        );

        expect(remove).toHaveBeenCalledWith('u1');
    });

    it('sends the search to the server and drops the old page number', async () => {
        const list = stubUsers();

        renderWithProviders(<Admin />, {
            store: makeStore(),
            route: '/admin?page=3&search=old',
        });

        await userEvent.click(
            await screen.findByRole('tab', { name: 'Users' })
        );
        await screen.findByText('Ania');

        const field = screen.getByLabelText('Search by nickname');

        await userEvent.clear(field);
        await userEvent.type(field, 'mar');
        await userEvent.click(screen.getByRole('button', { name: 'Search' }));

        // Page 3 of the old query means nothing for the new one.
        expect(list).toHaveBeenLastCalledWith({ page: 1, search: 'mar' });
    });
});
