import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Question } from '../../services/models';
import QuizService from '../../services/Quiz';
import type { QuizStats, SubmitResult } from '../../services/types';
import { setQuiz, submitAttempt } from '../../store/reducers/quiz';
import { makeStore, renderWithProviders, signIn } from '../../test/helpers';
import { Result } from '.';

const makeQuestion = (id: string): Question => ({
    _id: id,
    question: `Question ${id}`,
    answers: [
        { id: `${id}-a`, text: 'Answer A' },
        { id: `${id}-b`, text: 'Answer B' },
    ],
    correctAnswers: [`${id}-a`],
    img: null,
});

const submission: SubmitResult = {
    attempt: {
        _id: 'attempt-1',
        user: 'user-1',
        quiz: 'quiz-1',
        correctCount: 2,
        questionCount: 2,
        percent: 100,
        answers: [],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
    correctCount: 2,
    questionCount: 2,
    percent: 100,
    results: [
        { questionId: 'q1', correct: true, correctAnswers: ['q1-a'] },
        { questionId: 'q2', correct: true, correctAnswers: ['q2-a'] },
    ],
};

const stats: QuizStats = {
    count: 3,
    best: 90,
    average: 70,
    last: 80,
    history: [],
};

const renderResult = () => {
    const store = makeStore();

    store.dispatch(
        setQuiz({
            title: 'Anatomy',
            questions: [makeQuestion('q1'), makeQuestion('q2')],
        })
    );
    store.dispatch(
        submitAttempt.fulfilled(submission, 'test-request', {
            quizId: 'quiz-1',
            answers: [],
        })
    );
    signIn(store);

    renderWithProviders(<Result quizId="quiz-1" />, { store });
};

describe('Result stats', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows the stats error and refetches when retried', async () => {
        const statsRequest = vi
            .spyOn(QuizService, 'getQuizStats')
            .mockRejectedValueOnce(new Error('Stats unavailable'))
            .mockResolvedValueOnce({ message: 'ok', payload: stats });

        renderResult();

        expect(
            await screen.findByText('Could not load your stats')
        ).toBeInTheDocument();
        expect(screen.getByText('Stats unavailable')).toBeInTheDocument();

        await userEvent.click(
            screen.getByRole('button', { name: 'Try again' })
        );

        expect(await screen.findByText(/Attempt 3/)).toBeInTheDocument();
        expect(statsRequest).toHaveBeenCalledTimes(2);
    });
});
