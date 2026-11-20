import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import QuestionService from '../../services/Question';
import QuizService from '../../services/Quiz';
import { makeStore, renderWithProviders } from '../../test/helpers';
import { QuizConstructor } from '.';
import { DRAFT_KEY } from './draft';

vi.mock('../../services/Question', () => ({
    default: {
        createQuestion: vi.fn(),
        removeQuestion: vi.fn(),
    },
}));

vi.mock('../../services/Quiz', () => ({
    default: {
        createQuiz: vi.fn(),
    },
}));

const renderConstructor = () => {
    const store = makeStore();

    renderWithProviders(<QuizConstructor />, { store });

    return store;
};

describe('QuizConstructor', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        window.localStorage.clear();
    });

    it('starts with a single blank question card', () => {
        renderConstructor();

        expect(screen.getByText('Question 1')).toBeInTheDocument();
        expect(screen.queryByText('Question 2')).not.toBeInTheDocument();
        expect(screen.getByText('1 question in this quiz')).toBeInTheDocument();
    });

    it('adds one card per click instead of asking for a count', () => {
        renderConstructor();

        expect(
            screen.queryByLabelText('Questions amount')
        ).not.toBeInTheDocument();

        return (async () => {
            await userEvent.click(
                screen.getByRole('button', { name: /Add question/ })
            );
            await userEvent.click(
                screen.getByRole('button', { name: /Add question/ })
            );

            expect(screen.getByText('Question 3')).toBeInTheDocument();
            expect(
                screen.getByText('3 questions in this quiz')
            ).toBeInTheDocument();
        })();
    });

    it('blocks saving and points at every incomplete card', async () => {
        renderConstructor();

        await userEvent.click(
            screen.getByRole('button', { name: /Add question/ })
        );
        await userEvent.click(
            screen.getByRole('button', { name: /Save quiz/ })
        );

        // The message sits under the field that caused it, one per card, and
        // the field itself is marked - a banner at the top is not feedback when
        // the author is looking at question two.
        expect(screen.getAllByText('Add the question text')).toHaveLength(2);
        expect(screen.getAllByText('Needs attention')).toHaveLength(2);
        expect(screen.getAllByLabelText('Question')).toHaveLength(2);
        screen
            .getAllByLabelText('Question')
            .forEach((field) =>
                expect(field).toHaveAttribute('aria-invalid', 'true')
            );
        expect(screen.getByLabelText('Quiz title')).toHaveAttribute(
            'aria-invalid',
            'true'
        );
        expect(
            screen.getByText('Quiz title cannot be empty')
        ).toBeInTheDocument();
        expect(QuizService.createQuiz).not.toHaveBeenCalled();
        expect(QuestionService.createQuestion).not.toHaveBeenCalled();
    });

    it('clears a field error as soon as the author starts fixing it', async () => {
        renderConstructor();

        await userEvent.click(
            screen.getByRole('button', { name: /Save quiz/ })
        );

        expect(screen.getByLabelText('Quiz title')).toHaveAttribute(
            'aria-invalid',
            'true'
        );

        await userEvent.type(screen.getByLabelText('Quiz title'), 'Anatomy');

        expect(screen.getByLabelText('Quiz title')).not.toHaveAttribute(
            'aria-invalid'
        );
        expect(
            screen.queryByText('Quiz title cannot be empty')
        ).not.toBeInTheDocument();
    });

    it('rejects a threshold outside 0-100 instead of clamping it', async () => {
        renderConstructor();

        await userEvent.type(screen.getByLabelText('Quiz title'), 'Anatomy');

        const threshold = screen.getByLabelText('Pass threshold, %');

        await userEvent.clear(threshold);
        await userEvent.type(threshold, '150');
        await userEvent.click(
            screen.getByRole('button', { name: /Save quiz/ })
        );

        // Shown twice on purpose: inline under the field and in the alert.
        expect(
            screen.getAllByText('Threshold must be between 0 and 100').length
        ).toBeGreaterThan(0);
        expect(QuizService.createQuiz).not.toHaveBeenCalled();
    });

    it('offers an old draft instead of applying it silently', async () => {
        window.localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify({
                savedAt: Date.now(),
                title: 'Drafted quiz',
                threshold: '75',
                questions: [
                    {
                        id: 'q1',
                        question: 'Old question',
                        answers: [
                            { id: 'a', text: 'A' },
                            { id: 'b', text: 'B' },
                        ],
                        correctAnswers: ['a'],
                    },
                ],
            })
        );

        renderConstructor();

        expect(screen.getByText(/Unsaved draft from/)).toBeInTheDocument();
        expect(screen.getByLabelText('Quiz title')).toHaveValue('');

        await userEvent.click(
            screen.getByRole('button', { name: 'Restore draft' })
        );

        expect(screen.getByLabelText('Quiz title')).toHaveValue('Drafted quiz');
        expect(screen.getByLabelText('Pass threshold, %')).toHaveValue(75);
    });
});
