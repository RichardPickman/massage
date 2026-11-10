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

    it('promotes signing in to signed-out visitors', () => {
        const getMine = vi.spyOn(StatsService, 'getMine');

        renderWithProviders(<StatsPage />, { store: makeStore() });

        expect(
            screen.getByRole('heading', { name: /learn the body/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Sign in' })
        ).toBeInTheDocument();
        expect(getMine).not.toHaveBeenCalled();
    });

    it('renders the summary and per-test rows for a signed-in user', async () => {
        vi.spyOn(StatsService, 'getMine').mockResolvedValue(response(stats));

        const store = makeStore();
        signIn(store);

        renderWithProviders(<StatsPage />, { store });

        expect(
            await screen.findByRole('heading', { name: 'Your test record' })
        ).toBeInTheDocument();
        expect(screen.getByText('72')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Anatomy' })).toHaveAttribute(
            'href',
            '/quiz/quiz-1'
        );
        expect(
            screen.getByRole('img', { name: 'Anatomy score trend' })
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

        expect(
            await screen.findByRole('heading', { name: 'Your test record' })
        ).toBeInTheDocument();
        expect(getMine).toHaveBeenCalledTimes(2);
    });
});
