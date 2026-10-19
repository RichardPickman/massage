import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UserService from '../../services/User';
import { makeStore, renderWithProviders } from '../../test/helpers';
import SignIn from '.';

const routes = (
    <Routes>
        <Route path="/" element={<p>Lectures page</p>} />
        <Route path="/auth/login" element={<SignIn />} />
        <Route path="/quiz/constructor" element={<p>Constructor page</p>} />
    </Routes>
);

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

        await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

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

        await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(await screen.findByText('Lectures page')).toBeInTheDocument();
    });
});
