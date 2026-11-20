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
        answers: [
            {
                question: 'q1',
                selected: ['q1-a'],
                questionText: 'Question q1',
                answers: [
                    { id: 'q1-a', text: 'Answer A' },
                    { id: 'q1-b', text: 'Answer B' },
                ],
                correct: true,
            },
            {
                question: 'q2',
                selected: ['q2-a'],
                questionText: 'Question q2',
                answers: [
                    { id: 'q2-a', text: 'Answer A' },
                    { id: 'q2-b', text: 'Answer B' },
                ],
                correct: true,
            },
        ],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
    correctCount: 2,
    questionCount: 2,
    percent: 100,
    threshold: 50,
    passed: true,
    results: [
        {
            questionId: 'q1',
            correct: true,
            correctAnswers: ['q1-a'],
            questionText: 'Question q1',
            answers: [
                { id: 'q1-a', text: 'Answer A' },
                { id: 'q1-b', text: 'Answer B' },
            ],
        },
        {
            questionId: 'q2',
            correct: true,
            correctAnswers: ['q2-a'],
            questionText: 'Question q2',
            answers: [
                { id: 'q2-a', text: 'Answer A' },
                { id: 'q2-b', text: 'Answer B' },
            ],
        },
    ],
};

const stats: QuizStats = {
    count: 3,
    best: 90,
    average: 70,
    last: 80,
    history: [],
};

const renderResult = (
    submissionOverride: Partial<SubmitResult> = {},
    questions = [makeQuestion('q1'), makeQuestion('q2')]
) => {
    const store = makeStore();

    store.dispatch(
        setQuiz({
            title: 'Anatomy',
            questions,
        })
    );
    store.dispatch(
        submitAttempt.fulfilled(
            { ...submission, ...submissionOverride },
            'test-request',
            { quizId: 'quiz-1', answers: [] }
        )
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

describe('Result verdict', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows a pass badge together with the pass mark', () => {
        vi.spyOn(QuizService, 'getQuizStats').mockResolvedValue({
            message: 'ok',
            payload: stats,
        });

        renderResult({ threshold: 50, passed: true, percent: 100 });

        expect(screen.getByText('Passed')).toBeInTheDocument();
        expect(screen.getByText('Pass mark 50%')).toBeInTheDocument();
        expect(screen.getByText("You've got 2 of 2 right")).toBeInTheDocument();
    });

    it('shows a failure badge when the threshold was missed', () => {
        vi.spyOn(QuizService, 'getQuizStats').mockResolvedValue({
            message: 'ok',
            payload: stats,
        });

        renderResult({ threshold: 75, passed: false, percent: 50 });

        expect(screen.getByText('Not passed')).toBeInTheDocument();
        expect(screen.getByText('Pass mark 75%')).toBeInTheDocument();
    });

    it('shows no verdict for attempts judged before thresholds existed', () => {
        vi.spyOn(QuizService, 'getQuizStats').mockResolvedValue({
            message: 'ok',
            payload: stats,
        });

        renderResult({ threshold: null, passed: null, percent: 100 });

        expect(
            screen.getByText('This quiz has no pass mark.')
        ).toBeInTheDocument();
        expect(screen.queryByText('Passed')).not.toBeInTheDocument();
        expect(screen.queryByText('Not passed')).not.toBeInTheDocument();
    });

    it('renders the review from the snapshot when the question is gone', async () => {
        vi.spyOn(QuizService, 'getQuizStats').mockResolvedValue({
            message: 'ok',
            payload: stats,
        });

        // q2 was deleted from the quiz after the attempt was submitted.
        renderResult({}, [makeQuestion('q1')]);

        await userEvent.click(screen.getByRole('button', { name: /Unfold/ }));

        expect(screen.getByText('Question q2')).toBeInTheDocument();
    });
});
