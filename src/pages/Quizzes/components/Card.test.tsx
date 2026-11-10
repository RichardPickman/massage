import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import QuizService from '../../../services/Quiz';
import { fetchLogin } from '../../../store/reducers/auth/fetch';
import {
    makeStore,
    renderWithProviders,
    signIn,
    testUser,
} from '../../../test/helpers';
import { QuizCard } from './Card';

const quiz = {
    _id: 'quiz-1',
    title: 'Anatomy',
    questions: ['q1', 'q2'],
};

describe('QuizCard deletion', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('keeps the card and shows the error when removal fails', async () => {
        const store = makeStore();

        signIn(store);

        vi.spyOn(QuizService, 'removeQuiz').mockRejectedValue(
            new Error('Delete failed')
        );

        renderWithProviders(<QuizCard quiz={quiz} />, { store });

        await userEvent.click(
            screen.getByRole('button', { name: 'Remove Anatomy' })
        );
        await userEvent.click(screen.getByRole('button', { name: 'Remove' }));

        expect(
            await screen.findByText('Quiz was not removed')
        ).toBeInTheDocument();
        expect(screen.getByText('Delete failed')).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Anatomy' })
        ).toBeInTheDocument();
    });

    it('hides removal for a quiz authored by someone else', () => {
        const store = makeStore();
        store.dispatch(
            fetchLogin.fulfilled(
                {
                    token: 'test-token',
                    user: { ...testUser, id: 'user-2', role: 'user' },
                },
                'test-request',
                { email: testUser.email, password: 'test-password' }
            )
        );

        renderWithProviders(<QuizCard quiz={{ ...quiz, author: 'user-1' }} />, {
            store,
        });

        expect(
            screen.queryByRole('button', { name: 'Remove Anatomy' })
        ).not.toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Anatomy' })
        ).toBeInTheDocument();
    });
});
