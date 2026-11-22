import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import StatsService from '../../services/Stats';
import type { ApiResponse, OverallStats } from '../../services/types';
import { makeStore, renderWithProviders, signIn } from '../../test/helpers';
import { StatsPage } from '.';

const stats: OverallStats = {
    count: 3,
    best: 90,
    average: 72,
    last: 80,
    quizzes: [
        {
            quizId: 'quiz-1',
            title: 'Anatomy',
            count: 3,
            best: 90,
            average: 76,
            last: 80,
            history: [
                { percent: 80, createdAt: '2026-10-10T12:00:00.000Z' },
                { percent: 64, createdAt: '2026-10-09T12:00:00.000Z' },
                { percent: 90, createdAt: '2026-10-08T12:00:00.000Z' },
            ],
        },
    ],
};

const response = (payload: OverallStats): ApiResponse<OverallStats> => ({
    message: 'return stats',
    payload,
});

describe('StatsPage', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('opens a portal for signed-out visitors instead of the record', () => {
        const getMine = vi.spyOn(StatsService, 'getMine');

        renderWithProviders(<StatsPage />, { store: makeStore() });

        // The first screen says what the product is; it no longer pitches it.
        expect(
            screen.getByRole('heading', { name: 'Testing portal' })
        ).toBeInTheDocument();
        expect(
            screen.getAllByRole('link', { name: 'Sign in' })[0]
        ).toBeInTheDocument();
        expect(getMine).not.toHaveBeenCalled();
    });

    it('renders the summary and per-test rows for a signed-in user', async () => {
        vi.spyOn(StatsService, 'getMine').mockResolvedValue(response(stats));

        const store = makeStore();
        signIn(store);

        renderWithProviders(<StatsPage />, { store });

        const heading = await screen.findByRole('heading', {
            name: 'Your test record',
        });

        expect(heading).toBeInTheDocument();
        // The page title sits on the page, not inside a card: that framing is
        // what made the lectures screen look like a different application.
        expect(heading.closest('[data-slot="card"]')).toBeNull();
        // The table and the mobile card list both live in the DOM; a browser
        // shows one of them, jsdom applies no media queries.
        expect(screen.getAllByText('72')[0]).toBeInTheDocument();
        expect(
            screen.getAllByRole('link', { name: 'Anatomy' })[0]
        ).toHaveAttribute('href', '/quiz/quiz-1');
        expect(
            screen.getAllByRole('img', { name: 'Anatomy score trend' })[0]
        ).toBeInTheDocument();
        expect(
            screen.getByText('Last attempt 10 Oct 2026')
        ).toBeInTheDocument();
    });

    it('invites a first attempt when the record is empty', async () => {
        vi.spyOn(StatsService, 'getMine').mockResolvedValue(
            response({ count: 0, best: 0, average: 0, last: 0, quizzes: [] })
        );

        const store = makeStore();
        signIn(store);

        renderWithProviders(<StatsPage />, { store });

        expect(
            await screen.findByText('No attempts on record')
        ).toBeInTheDocument();
    });

    it('offers a retry when the request fails', async () => {
        const getMine = vi
            .spyOn(StatsService, 'getMine')
            .mockRejectedValueOnce(new Error('Network down'))
            .mockResolvedValue(response(stats));

        const store = makeStore();
        signIn(store);

        renderWithProviders(<StatsPage />, { store });

        expect(
            await screen.findByText('Stats unavailable')
        ).toBeInTheDocument();
        expect(screen.getByText('Network down')).toBeInTheDocument();

        await userEvent.click(
            screen.getByRole('button', { name: 'Try again' })
        );

        const heading = await screen.findByRole('heading', {
            name: 'Your test record',
        });

        expect(heading).toBeInTheDocument();
        // The page title sits on the page, not inside a card: that framing is
        // what made the lectures screen look like a different application.
        expect(heading.closest('[data-slot="card"]')).toBeNull();
        expect(getMine).toHaveBeenCalledTimes(2);
    });
});
