import { describe, expect, it, vi, beforeEach } from 'vitest';
import QuizService from '../../../services/Quiz';
import { fetchRemove } from './fetch';

// The thunk resolves with the id, so the slice can drop one card; a failure carries
// the translated message instead of an Error object the UI cannot render.
describe('fetchRemove', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('resolves with the removed id', async () => {
        vi.spyOn(QuizService, 'removeQuiz').mockResolvedValue({
            payload: {},
            message: 'ok',
        } as never);

        const dispatch = vi.fn();
        const result = await fetchRemove('abc')(
            dispatch,
            () => ({}),
            undefined
        );

        expect(result.payload).toBe('abc');
        expect(QuizService.removeQuiz).toHaveBeenCalledWith('abc');
    });

    it('rejects with the server message', async () => {
        vi.spyOn(QuizService, 'removeQuiz').mockRejectedValue(
            Object.assign(new Error('Brak uprawnień'), { status: 403 })
        );

        const result = await fetchRemove('abc')(vi.fn(), () => ({}), undefined);

        expect(fetchRemove.rejected.match(result)).toBe(true);
        expect(result.payload).toBe('Brak uprawnień');
    });
});
