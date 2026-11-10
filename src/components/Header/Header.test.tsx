import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { fetchRefresh } from '../../store/reducers/auth/fetch';
import { makeStore, renderWithProviders, signIn } from '../../test/helpers';
import { Header } from '.';

describe('Header', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('offers sign in and sign up to signed-out visitors', () => {
        renderWithProviders(<Header />, { store: makeStore() });

        expect(
            screen.getByRole('link', { name: 'Sign in' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Sign up' })
        ).toBeInTheDocument();
    });

    it('shows the account menu instead of auth links when signed in', () => {
        const store = makeStore();
        signIn(store);

        renderWithProviders(<Header />, { store });

        expect(
            screen.getByRole('button', { name: /author@example\.com/i })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: 'Sign in' })
        ).not.toBeInTheDocument();
    });

    it('waits for the session refresh instead of flashing auth links', () => {
        const store = makeStore();
        store.dispatch(fetchRefresh.pending('test-request'));

        renderWithProviders(<Header />, { store });

        expect(
            screen.queryByRole('link', { name: 'Sign in' })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: /author@example/i })
        ).not.toBeInTheDocument();
    });
});
