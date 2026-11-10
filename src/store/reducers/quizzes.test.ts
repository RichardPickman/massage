import { afterEach, describe, expect, it, vi } from 'vitest';
import QuizService from '../../services/Quiz';
import type { QuizSummary } from '../../services/models';
import type { Page } from '../../services/types';
import { makeStore } from '../../test/helpers';
import { fetchStatuses } from '../../utils/consts';
import { setQuizzes } from './quizzes';
import { fetchRemove } from './quizzes/fetch';

const quiz = (id: string): QuizSummary => ({
    _id: id,
    title: `Quiz ${id}`,
    questions: ['q1', 'q2'],
});

const pageOf = (
    items: QuizSummary[],
    page: number,
    pages: number
): Page<QuizSummary> => ({
    items,
    total: pages * 12,
    page,
    limit: 12,
    pages,
});

const storeWithPage = () => {
    const store = makeStore();
    store.dispatch(
        setQuizzes(pageOf([quiz('quiz-1'), quiz('quiz-2')], 2, 3))
    );

    return store;
};

describe('setQuizzes', () => {
    it('keeps the page envelope the loader hands over', () => {
        const { quizzes } = storeWithPage().getState();

        expect(quizzes.quizzes.map(({ _id }) => _id)).toEqual([
            'quiz-1',
            'quiz-2',
        ]);
        expect(quizzes.page).toBe(2);
        expect(quizzes.pages).toBe(3);
        expect(quizzes.total).toBe(36);
    });

    it('replaces the page instead of appending to it', () => {
        const store = storeWithPage();

        store.dispatch(setQuizzes(pageOf([quiz('quiz-3')], 3, 3)));

        expect(store.getState().quizzes.quizzes.map(({ _id }) => _id)).toEqual([
            'quiz-3',
        ]);
        expect(store.getState().quizzes.page).toBe(3);
    });
});

describe('fetchRemove', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('drops the removed quiz and asks the listing to reload its page', async () => {
        vi.spyOn(QuizService, 'removeQuiz').mockResolvedValue({
            message: 'Removed successfully',
            payload: quiz('quiz-1'),
        });

        const store = storeWithPage();

        await store.dispatch(fetchRemove('quiz-1'));

        const { quizzes, revision } = store.getState().quizzes;

        expect(quizzes.map(({ _id }) => _id)).toEqual(['quiz-2']);
        expect(revision).toBe(1);
    });

    it('keeps the page and reports the failure when the server refuses', async () => {
        vi.spyOn(QuizService, 'removeQuiz').mockRejectedValue(
            new Error('Delete failed')
        );

        const store = storeWithPage();

        await store.dispatch(fetchRemove('quiz-1'));

        const { quizzes, status, errors, revision } = store.getState().quizzes;

        expect(quizzes.map(({ _id }) => _id)).toEqual([
            'quiz-1',
            'quiz-2',
        ]);
        expect(status).toBe(fetchStatuses.FAILED);
        expect(errors).toEqual(['Delete failed']);
        expect(revision).toBe(0);
    });
});
