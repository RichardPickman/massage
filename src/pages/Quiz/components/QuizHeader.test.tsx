import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { setLanguage } from '../../../i18n';
import { makeStore, renderWithProviders } from '../../../test/helpers';
import { QuizHeader } from './QuizHeader';

const renderHeader = () =>
    renderWithProviders(
        <QuizHeader
            title="Endodoncja — ciąg dalszy II — test"
            current={3}
            total={21}
        />,
        { store: makeStore(), route: '/quiz/abc' }
    );

describe('QuizHeader', () => {
    it('keeps the title in the document without shouting it', () => {
        renderHeader();

        // The heading still names the page for a screen reader and the tab, but it
        // is not the loudest thing on a screen where the question must be.
        const heading = screen.getByRole('heading', { level: 1 });

        expect(heading).toHaveTextContent('Endodoncja');
        expect(heading).toHaveClass('sr-only');
    });

    it('carries where the student is, and how far they have come', () => {
        renderHeader();

        expect(screen.getByText('Question 3 of 21')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('keeps the way out reachable on a phone', async () => {
        await setLanguage('en');
        renderHeader();

        // The words fold away below sm, so the arrow needs the name from aria-label
        // or the link becomes "link" to a screen reader.
        expect(screen.getByRole('link', { name: 'All tests' })).toHaveAttribute(
            'href',
            '/quiz'
        );
    });
});
