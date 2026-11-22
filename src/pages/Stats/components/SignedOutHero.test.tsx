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

        // The screen says what the product is and offers what it has; the old
        // headline and the three numbered steps are gone.
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
            'Portal testowy'
        );
        expect(screen.getByRole('link', { name: 'Testy' })).toHaveAttribute(
            'href',
            '/quiz'
        );
        expect(screen.getByRole('link', { name: 'Wykłady' })).toHaveAttribute(
            'href',
            '/lectures'
        );
    });

    it('follows the interface language', async () => {
        await setLanguage('en');

        renderHero();

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
            'Testing portal'
        );
        expect(screen.getByRole('link', { name: 'Tests' })).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'create an account' })
        ).toHaveAttribute('href', '/auth/register');
    });
});
