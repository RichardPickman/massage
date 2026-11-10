import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RouteObject } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import QuizService from '../../services/Quiz';
import type { QuizSummary } from '../../services/models';
import type { ApiResponse, Page } from '../../services/types';
import { makeStore, renderWithDataRouter, signIn } from '../../test/helpers';
import { Quizzes, loader } from '.';

const quiz = (id: string, questions?: string[]): QuizSummary => ({
    _id: id,
    title: `Quiz ${id}`,
    questions: questions ?? ['q1', 'q2'],
});

const pageOf = (
    items: QuizSummary[],
    page: number,
    pages: number
): ApiResponse<Page<QuizSummary>> => ({
    message: 'return quizzes',
    payload: { items, total: pages * 12, page, limit: 12, pages },
});

const routes: RouteObject[] = [{ path: '/quiz', element: <Quizzes />, loader }];

const renderQuizzes = (route = '/quiz') => {
    const store = makeStore();
    signIn(store);

    renderWithDataRouter(routes, { store, route });
};

describe('Quizzes page', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the cards of the page in the address', async () => {
        vi.spyOn(QuizService, 'getQuizzesPage').mockResolvedValue(
            pageOf([quiz('page-2')], 2, 2)
        );

        renderQuizzes('/quiz?page=2');

        expect(
            await screen.findByRole('link', { name: 'Quiz page-2' })
        ).toBeInTheDocument();
        expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    });

    it('keeps the empty copy when there are no quizzes', async () => {
        vi.spyOn(QuizService, 'getQuizzesPage').mockResolvedValue(
            pageOf([], 1, 0)
        );

        renderQuizzes();

        expect(
            await screen.findByText('There is no quiz yet.')
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('navigation', { name: 'pagination' })
        ).not.toBeInTheDocument();
    });

    it('hides the controls when the collection fits on one page', async () => {
        vi.spyOn(QuizService, 'getQuizzesPage').mockResolvedValue(
            pageOf([quiz('only')], 1, 1)
        );

        renderQuizzes();

        expect(
            await screen.findByRole('link', { name: 'Quiz only' })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('navigation', { name: 'pagination' })
        ).not.toBeInTheDocument();
    });

    it('opens on the first page with only the way forward live', async () => {
        vi.spyOn(QuizService, 'getQuizzesPage').mockResolvedValue(
            pageOf([quiz('first')], 1, 3)
        );

        renderQuizzes();

        const previous = await screen.findByRole('link', {
            name: 'Go to previous page',
        });

        expect(previous).toHaveAttribute('aria-disabled', 'true');
        expect(
            screen.getByRole('link', { name: 'Go to next page' })
        ).not.toHaveAttribute('aria-disabled');
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });

    it('closes on the last page with only the way back live', async () => {
        vi.spyOn(QuizService, 'getQuizzesPage').mockResolvedValue(
            pageOf([quiz('last')], 3, 3)
        );

        renderQuizzes('/quiz?page=3');

        const next = await screen.findByRole('link', {
            name: 'Go to next page',
        });

        expect(next).toHaveAttribute('aria-disabled', 'true');
        expect(
            screen.getByRole('link', { name: 'Go to previous page' })
        ).not.toHaveAttribute('aria-disabled');
    });

    it('counts the questions on each card, populated or not', async () => {
        vi.spyOn(QuizService, 'getQuizzesPage').mockResolvedValue(
            pageOf(
                [
                    quiz('two'),
                    quiz('one', ['q1']),
                    quiz('none', []),
                ],
                1,
                1
            )
        );

        renderQuizzes();

        expect(await screen.findByText('2 questions')).toBeInTheDocument();
        expect(screen.getByText('1 question')).toBeInTheDocument();
        expect(screen.getByText('0 questions')).toBeInTheDocument();
    });

    it('lands on the previous page when the last card on the last page is removed', async () => {
        let removed = false;

        const getPage = vi
            .spyOn(QuizService, 'getQuizzesPage')
            .mockImplementation(() =>
                // One card is left once the only card on page two is gone, so
                // the backend answers any request for page two with page one.
                Promise.resolve(
                    removed
                        ? pageOf([quiz('page-1')], 1, 1)
                        : pageOf([quiz('page-2')], 2, 2)
                )
            );

        vi.spyOn(QuizService, 'removeQuiz').mockImplementation(() => {
            removed = true;

            return Promise.resolve({
                message: 'Removed successfully',
                payload: quiz('page-2'),
            });
        });

        renderQuizzes('/quiz?page=2');

        await userEvent.click(
            await screen.findByRole('button', { name: 'Remove Quiz page-2' })
        );
        await userEvent.click(screen.getByRole('button', { name: 'Remove' }));

        expect(
            await screen.findByRole('link', { name: 'Quiz page-1' })
        ).toBeInTheDocument();
        expect(screen.queryByText('Page 2 of 2')).not.toBeInTheDocument();
        expect(getPage).toHaveBeenLastCalledWith(1, 12);
    });
});
