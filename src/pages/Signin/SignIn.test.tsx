import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../services/errors';
import UserService from '../../services/User';
import { makeStore, renderWithProviders } from '../../test/helpers';
import SignIn from '.';

const routes = (
    <Routes>
        <Route path="/" element={<p>Overview page</p>} />
        <Route path="/auth/login" element={<SignIn />} />
        <Route path="/quiz/constructor" element={<p>Constructor page</p>} />
    </Routes>
);

const submitCredentials = async () => {
    await userEvent.type(screen.getByLabelText('Email'), 'author@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'test-password');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
};

describe('SignIn', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('returns to the guarded page after signing in', async () => {
        vi.spyOn(UserService, 'login').mockResolvedValue({
            token: 'test-token',
        });

        renderWithProviders(routes, {
            store: makeStore(),
            route: {
                pathname: '/auth/login',
                state: { from: '/quiz/constructor' },
            },
        });

        await submitCredentials();

        expect(await screen.findByText('Constructor page')).toBeInTheDocument();
    });

    it('falls back to the home page when there is no return path', async () => {
        vi.spyOn(UserService, 'login').mockResolvedValue({
            token: 'test-token',
        });

        renderWithProviders(routes, {
            store: makeStore(),
            route: '/auth/login',
        });

        await submitCredentials();

        expect(await screen.findByText('Overview page')).toBeInTheDocument();
    });

    it('asks for no invite code, because the account already exists', () => {
        renderWithProviders(routes, {
            store: makeStore(),
            route: '/auth/login',
        });

        expect(screen.queryByLabelText('Invite code')).not.toBeInTheDocument();
    });

    it('passes on the wait when the server refuses repeated attempts', async () => {
        vi.spyOn(UserService, 'login').mockRejectedValue(
            new ApiError(
                429,
                'Too many attempts. Wait a few minutes and try again.'
            )
        );

        renderWithProviders(routes, {
            store: makeStore(),
            route: '/auth/login',
        });

        await submitCredentials();

        expect(
            await screen.findByText(
                'Too many attempts. Wait a few minutes and try again.'
            )
        ).toBeInTheDocument();
        expect(screen.queryByText('Overview page')).not.toBeInTheDocument();
    });
});
