import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '../../services/errors';
import UserService from '../../services/User';
import { makeStore, renderWithProviders } from '../../test/helpers';
import SignUp from '.';

const routes = (
    <Routes>
        <Route path="/auth/register" element={<SignUp />} />
        <Route path="/auth/login" element={<p>Sign-in page</p>} />
    </Routes>
);

const submitRegistration = async (code: string) => {
    await userEvent.type(screen.getByLabelText('Email'), 'friend@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'a-long-password');
    await userEvent.type(screen.getByLabelText('Invite code'), code);
    await userEvent.click(
        screen.getByRole('button', { name: 'Create account' })
    );
};

describe('SignUp', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('sends the invite code with the address and returns to sign in', async () => {
        const registration = vi
            .spyOn(UserService, 'registration')
            .mockResolvedValue({ token: '' });

        renderWithProviders(routes, {
            store: makeStore(),
            route: '/auth/register',
        });

        await submitRegistration('ABCD-1234-EF56-7890');

        expect(registration).toHaveBeenCalledWith({
            email: 'friend@example.com',
            password: 'a-long-password',
            code: 'ABCD-1234-EF56-7890',
        });
        expect(await screen.findByText('Sign-in page')).toBeInTheDocument();
    });

    it('shows the refusal without discarding what was typed', async () => {
        vi.spyOn(UserService, 'registration').mockRejectedValue(
            new ApiError(
                403,
                'This address needs a valid invite code to register'
            )
        );

        renderWithProviders(routes, {
            store: makeStore(),
            route: '/auth/register',
        });

        await submitRegistration('wrong-code');

        expect(
            await screen.findByText(
                'This address needs a valid invite code to register'
            )
        ).toBeInTheDocument();
        // Re-typing the address after a refusal would be the form's own fault,
        // and the code is the thing that most likely needs correcting.
        expect(screen.getByLabelText('Email')).toHaveValue(
            'friend@example.com'
        );
        expect(screen.getByLabelText('Invite code')).toHaveValue('wrong-code');
        expect(screen.queryByText('Sign-in page')).not.toBeInTheDocument();
    });
});
