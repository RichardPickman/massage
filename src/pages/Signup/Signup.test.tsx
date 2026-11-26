import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SignUp from '.';
import { ApiError } from '../../services/errors';
import UserService from '../../services/User';
import { makeStore, renderWithProviders } from '../../test/helpers';

const routes = (
    <Routes>
        <Route path="/auth/register" element={<SignUp />} />
        <Route path="/auth/login" element={<p>Sign-in page</p>} />
    </Routes>
);

const submitRegistration = async (code: string) => {
    // Registration asks for a nickname, a password and the shared code: an
    // address is never verified, and the server derives one from the nickname.
    await userEvent.type(screen.getByLabelText('Nickname'), 'Ania');
    await userEvent.type(screen.getByLabelText('Password'), 'a-long-password');
    await userEvent.type(screen.getByLabelText('Registration code'), code);
    await userEvent.click(
        screen.getByRole('button', { name: 'Create account' })
    );
};

describe('SignUp', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('sends the registration code and never asks for an address', async () => {
        const registration = vi
            .spyOn(UserService, 'registration')
            .mockResolvedValue({ token: '' });

        renderWithProviders(routes, {
            store: makeStore(),
            route: '/auth/register',
        });

        expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();

        await submitRegistration('o84vo4');

        expect(registration).toHaveBeenCalledWith({
            user: 'Ania',
            password: 'a-long-password',
            code: 'o84vo4',
        });
        expect(await screen.findByText('Sign-in page')).toBeInTheDocument();
    });

    it('shows the refusal without discarding what was typed', async () => {
        vi.spyOn(UserService, 'registration').mockRejectedValue(
            new ApiError(403, 'A valid registration code is required')
        );

        renderWithProviders(routes, {
            store: makeStore(),
            route: '/auth/register',
        });

        await submitRegistration('wrong-code');

        expect(
            await screen.findByText('A valid registration code is required')
        ).toBeInTheDocument();
        // Re-typing the nickname after a refusal would be the form's own fault,
        // and the code is the thing that most likely needs correcting.
        expect(screen.getByLabelText('Nickname')).toHaveValue('Ania');
        expect(screen.getByLabelText('Registration code')).toHaveValue(
            'wrong-code'
        );
        expect(screen.queryByText('Sign-in page')).not.toBeInTheDocument();
    });
});
