import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { setLanguage } from '../../../i18n';
import { makeStore, renderWithProviders } from '../../../test/helpers';
import { SignedOutHero } from './SignedOutHero';

const renderHero = () =>
    renderWithProviders(<SignedOutHero />, { store: makeStore() });

describe('SignedOutHero', () => {
    afterEach(async () => {
        await setLanguage('en');
    });

    it('is a portal, not a pitch', async () => {
        await setLanguage('pl');

        renderHero();

        // The screen says what the product is and offers the way in; the old
        // headline and the three numbered steps are gone.
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
            'Portal testowy'
        );
        // A guest gets this page and nothing else, so no link leads into the
        // content - only to signing in or registering.
        // The word appears twice now — on the button and in the note below it.
        expect(
            screen.getAllByRole('link', { name: 'Zaloguj się' })[0]
        ).toHaveAttribute('href', '/auth/login');
        expect(
            screen.getAllByRole('link', { name: 'załóż konto' })[0]
        ).toHaveAttribute('href', '/auth/register');
        expect(screen.queryByRole('link', { name: 'Testy' })).toBeNull();
        expect(screen.queryByRole('link', { name: 'Wykłady' })).toBeNull();
    });

    it('follows the interface language', async () => {
        await setLanguage('en');

        renderHero();

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
            'Testing portal'
        );
        expect(
            screen.getAllByRole('link', { name: /create an account/i })[0]
        ).toHaveAttribute('href', '/auth/register');
        expect(screen.queryByRole('link', { name: 'Tests' })).toBeNull();
    });
});
