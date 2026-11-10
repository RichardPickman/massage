import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { fetchLogin } from '../../store/reducers/auth/fetch';
import {
    makeStore,
    renderWithProviders,
    signIn,
    testUser,
} from '../../test/helpers';
import { RequireAuth } from '../RequireAuth';
import { RequireAdmin } from '.';

const routes = (
    <Routes>
        <Route path="/auth/login" element={<p>Sign-in page</p>} />
        <Route
            path="/admin"
            element={
                <RequireAuth>
                    <RequireAdmin>
                        <p>Invite panel</p>
                    </RequireAdmin>
                </RequireAuth>
            }
        />
    </Routes>
);

describe('RequireAdmin', () => {
    it('shows the panel to an admin', async () => {
        const store = makeStore();

        signIn(store);

        renderWithProviders(routes, { store, route: '/admin' });

        expect(await screen.findByText('Invite panel')).toBeInTheDocument();
    });

    it('tells a signed-in ordinary user the area is not theirs', async () => {
        const store = makeStore();

        store.dispatch(
            fetchLogin.fulfilled(
                { token: 'test-token', user: { ...testUser, role: 'user' } },
                'test-request',
                { email: testUser.email, password: 'test-password' }
            )
        );

        renderWithProviders(routes, { store, route: '/admin' });

        expect(await screen.findByText('Not your area')).toBeInTheDocument();
        expect(screen.queryByText('Invite panel')).not.toBeInTheDocument();
    });

    it('sends a signed-out visitor to sign in', async () => {
        renderWithProviders(routes, { store: makeStore(), route: '/admin' });

        expect(await screen.findByText('Sign-in page')).toBeInTheDocument();
    });
});
