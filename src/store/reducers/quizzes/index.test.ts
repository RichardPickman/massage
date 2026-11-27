import { describe, expect, it } from 'vitest';
import type { QuizSummary } from '../../../services/models';
import { fetchStatuses } from '../../../utils/consts';
import reducer, { setQuizzes } from '.';
import { fetchRemove } from './fetch';

// The listing keeps its numbers next to its rows, so the paginator and the totals
// cannot disagree. Removal is the one case where the slice updates itself: it drops
// the row and bumps a revision the page reloads on.

const quiz = (id: string): QuizSummary =>
    ({
        _id: id,
        title: `Test ${id}`,
        questions: [],
        threshold: 60,
    } as QuizSummary);

const initialState = reducer(undefined, { type: '@@init' });

describe('quizzes reducer', () => {
    it('starts empty and idle', () => {
        expect(initialState).toEqual({
            quizzes: [],
            page: 1,
            pages: 0,
            total: 0,
            status: fetchStatuses.IDLE,
            errors: [],
            revision: 0,
        });
    });

    it('stores a page together with its numbers', () => {
        const state = reducer(
            undefined,
            setQuizzes({
                items: [quiz('a'), quiz('b')],
                page: 2,
                pages: 3,
                total: 25,
                limit: 10,
            })
        );

        expect(state.quizzes.map((row) => row._id)).toEqual(['a', 'b']);
        expect(state.page).toBe(2);
        expect(state.pages).toBe(3);
        expect(state.total).toBe(25);
    });

    it('drops a removed quiz and asks for a reload', () => {
        const seeded = reducer(
            undefined,
            setQuizzes({
                items: [quiz('a'), quiz('b')],
                page: 1,
                pages: 1,
                total: 2,
                limit: 10,
            })
        );

        const state = reducer(
            seeded,
            fetchRemove.fulfilled('a', 'request', 'a')
        );

        expect(state.quizzes.map((row) => row._id)).toEqual(['b']);
        expect(state.revision).toBe(1);
    });

    it('records the server message when a removal fails', () => {
        const state = reducer(
            initialState,
            fetchRemove.rejected(null, 'request', 'a', 'Brak dostępu')
        );

        expect(state.errors).toEqual(['Brak dostępu']);
        expect(state.status).toBe(fetchStatuses.FAILED);
    });

    it('falls back to its own message when the server sends none', () => {
        const state = reducer(
            initialState,
            fetchRemove.rejected(null, 'request', 'a', undefined)
        );

        expect(state.errors).toEqual(['Failed to remove quiz']);
    });

    it('is pending while a removal is in flight', () => {
        const state = reducer(
            initialState,
            fetchRemove.pending('request', 'a')
        );

        expect(state.status).toBe(fetchStatuses.PENDING);
    });
});
