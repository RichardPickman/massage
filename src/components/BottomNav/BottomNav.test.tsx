import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { makeStore, renderWithProviders, signIn } from '../../test/helpers';
import { BottomNav } from '.';

const renderNav = (
    options: { signedIn?: boolean; route?: string; hidden?: boolean } = {}
) => {
    const { signedIn = true, route = '/', hidden = false } = options;
    const store = makeStore();

    if (signedIn) {
        signIn(store);
    }

    renderWithProviders(<BottomNav hidden={hidden} />, { store, route });

    return store;
};

describe('BottomNav', () => {
    it('shows the four primary destinations for a signed-in user', () => {
        renderNav();

        expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
            'href',
            '/'
        );
        expect(screen.getByRole('link', { name: 'Lectures' })).toHaveAttribute(
            'href',
            '/lectures'
        );
        expect(screen.getByRole('link', { name: 'Quizzes' })).toHaveAttribute(
            'href',
            '/quiz'
        );
        expect(
            screen.getByRole('button', { name: 'Account' })
        ).toBeInTheDocument();
    });

    it('marks the tab of the page you are on', () => {
        renderNav({ route: '/lectures' });

        expect(screen.getByRole('link', { name: 'Lectures' })).toHaveAttribute(
            'aria-current',
            'page'
        );
        expect(
            screen.getByRole('link', { name: 'Overview' })
        ).not.toHaveAttribute('aria-current');
    });

    it('offers sign in instead of account when signed out', () => {
        renderNav({ signedIn: false });

        expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
            'href',
            '/auth/login'
        );
        expect(
            screen.queryByRole('button', { name: 'Account' })
        ).not.toBeInTheDocument();
    });

    it('steps aside on auth screens', () => {
        renderNav({ route: '/auth/login' });

        expect(
            screen.queryByRole('link', { name: 'Overview' })
        ).not.toBeInTheDocument();
    });

    it('steps aside when the page claims the whole screen', () => {
        renderNav({ hidden: true });

        expect(
            screen.queryByRole('link', { name: 'Overview' })
        ).not.toBeInTheDocument();
    });

    it('opens the account sheet with the same actions as the header menu', async () => {
        renderNav();

        await userEvent.click(screen.getByRole('button', { name: 'Account' }));

        expect(screen.getByText('Signed in as')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Log out' })
        ).toBeInTheDocument();
        // Admin by fixture, so the invite entry is there too.
        expect(
            screen.getByRole('link', { name: 'Invite codes' })
        ).toBeInTheDocument();
    });
});
