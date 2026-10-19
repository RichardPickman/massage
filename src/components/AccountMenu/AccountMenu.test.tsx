import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getToken, setToken } from '../../services/helpers/token';
import UserService from '../../services/User';
import { makeStore, renderWithProviders, signIn } from '../../test/helpers';
import { AccountMenu } from '.';

describe('AccountMenu logout', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('clears the session even when the logout request fails', async () => {
        const store = makeStore();

        signIn(store);
        setToken('test-token');

        vi.spyOn(UserService, 'logout').mockRejectedValue(
            new Error('Server is down')
        );

        renderWithProviders(<AccountMenu />, { store });

        await userEvent.click(
            screen.getByRole('button', { name: /author@example\.com/i })
        );
        await userEvent.click(screen.getByRole('button', { name: 'Log out' }));

        await waitFor(() => {
            expect(store.getState().auth.user).toBeNull();
        });

        expect(store.getState().auth.isAuth).toBe(false);
        expect(getToken()).toBeNull();
        expect(
            screen.queryByText('author@example.com')
        ).not.toBeInTheDocument();
    });
});
