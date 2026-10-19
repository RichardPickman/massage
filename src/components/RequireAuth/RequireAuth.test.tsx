import { screen } from '@testing-library/react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { makeStore, renderWithProviders, signIn } from '../../test/helpers';
import { RequireAuth } from '.';
import { readSignInReturnPath } from './helpers';

const SignInProbe = () => {
    const location = useLocation();
    const from = readSignInReturnPath(location.state);

    return <p>sign-in page from {from ?? 'nowhere'}</p>;
};

const routes = (
    <Routes>
        <Route path="/auth/login" element={<SignInProbe />} />
        <Route
            path="/quiz/constructor"
            element={
                <RequireAuth>
                    <p>Constructor page</p>
                </RequireAuth>
            }
        />
    </Routes>
);

describe('RequireAuth', () => {
    it('redirects signed-out visitors and records the full requested path', async () => {
        renderWithProviders(routes, {
            store: makeStore(),
            route: {
                pathname: '/quiz/constructor',
                search: '?draft=1',
                hash: '#top',
            },
        });

        expect(
            await screen.findByText(
                'sign-in page from /quiz/constructor?draft=1#top'
            )
        ).toBeInTheDocument();
        expect(screen.queryByText('Constructor page')).not.toBeInTheDocument();
    });

    it('renders the guarded page for a signed-in visitor', async () => {
        const store = makeStore();

        signIn(store);

        renderWithProviders(routes, {
            store,
            route: '/quiz/constructor',
        });

        expect(await screen.findByText('Constructor page')).toBeInTheDocument();
        expect(screen.queryByText(/sign-in page/)).not.toBeInTheDocument();
    });
});

describe('readSignInReturnPath', () => {
    it('accepts an app-relative path', () => {
        expect(readSignInReturnPath({ from: '/quiz/constructor' })).toBe(
            '/quiz/constructor'
        );
    });

    it('rejects an absolute URL and missing state', () => {
        expect(
            readSignInReturnPath({ from: 'https://example.com' })
        ).toBeNull();
        expect(readSignInReturnPath({ from: 'quiz/constructor' })).toBeNull();
        expect(readSignInReturnPath(null)).toBeNull();
        expect(readSignInReturnPath({})).toBeNull();
    });
});
