import { screen } from '@testing-library/react';
import type { RouteObject } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import QuizService from '../../services/Quiz';
import type { Quiz as QuizModel } from '../../services/models';
import { makeStore, renderWithDataRouter } from '../../test/helpers';
import { Quiz, loader } from '.';

const quiz: QuizModel = {
    _id: 'quiz-1',
    title: 'Anatomy',
    questions: [
        {
            _id: 'q1',
            question: 'Which muscle flexes the elbow?',
            answers: [
                { id: 'a1', text: 'Biceps brachii' },
                { id: 'a2', text: 'Triceps brachii' },
            ],
            correctAnswers: ['a1'],
            img: null,
        },
    ],
};

const routes: RouteObject[] = [
    { path: '/quiz/:id', element: <Quiz />, loader },
];

const renderAttempt = () => {
    vi.spyOn(QuizService, 'getQuiz').mockResolvedValue({
        message: 'return quiz',
        payload: quiz,
    });

    renderWithDataRouter(routes, {
        store: makeStore(),
        route: '/quiz/quiz-1',
    });
};

describe('Quiz attempt', () => {
    it('opens on the first question with its answers', async () => {
        renderAttempt();

        expect(
            await screen.findByText('Which muscle flexes the elbow?')
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Biceps brachii' })
        ).toBeInTheDocument();
        // The counter is the header's kicker now: "Question 1 of 1".
        expect(screen.getByText('Question 1 of 1')).toBeInTheDocument();
    });

    it('offers a visible way back to the list of tests', async () => {
        renderAttempt();

        const back = await screen.findByRole('link', { name: 'All tests' });

        expect(back).toHaveAttribute('href', '/quiz');
    });

    it('claims the height the layout hands it, without a cap of its own', async () => {
        renderAttempt();

        const card = (
            await screen.findByText('Which muscle flexes the elbow?')
        ).closest('[data-slot="card"]');

        // jsdom lays nothing out, so the classes stand in for the geometry: the
        // question card grows into the page column and no viewport height is
        // hardcoded.
        expect(card).toHaveClass('flex-1', 'flex-col');
        expect(card?.className ?? '').not.toMatch(
            /(^|\s)(h-dvh|h-screen|max-h-)/
        );
    });

    it('grows the question area so the controls land at the bottom', async () => {
        renderAttempt();

        const card = (
            await screen.findByText('Which muscle flexes the elbow?')
        ).closest('[data-slot="card"]');

        expect(card?.querySelector('[data-slot="card-content"]')).toHaveClass(
            'flex-1'
        );
        // The controls left the card: they are a row of the page, after it.
        expect(card?.querySelector('[data-slot="card-footer"]')).toBeNull();
        expect(
            screen.getByRole('button', { name: 'Previous' })
        ).toBeInTheDocument();
        // One question, so the forward button is the one that finishes the test.
        expect(
            screen.getByRole('button', { name: 'Finish test' })
        ).toBeInTheDocument();
    });
});
