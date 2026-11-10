import type { LoaderFunctionArgs } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import QuizService from '../../services/Quiz';
import type { QuizSummary } from '../../services/models';
import type { Page } from '../../services/types';
import { loader } from '.';

const quiz = (id: string): QuizSummary => ({
    _id: id,
    title: `Quiz ${id}`,
    questions: [],
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

const answerWith = (page: number, pages: number) =>
    vi.spyOn(QuizService, 'getQuizzesPage').mockResolvedValue({
        message: 'return quizzes',
        payload: pageOf([quiz(`page-${page}`)], page, pages),
    });

const callLoader = (search = '') =>
    loader({
        request: new Request(`http://localhost/quiz${search}`),
    } as LoaderFunctionArgs);

describe('quizzes loader', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('reads the first page when the address carries no page', async () => {
        const getPage = answerWith(1, 3);

        const data = await callLoader();

        expect(getPage).toHaveBeenCalledWith(1, 12);
        expect(data).toEqual(pageOf([quiz('page-1')], 1, 3));
    });

    it('asks for the page the address names', async () => {
        const getPage = answerWith(2, 3);

        await callLoader('?page=2');

        expect(getPage).toHaveBeenCalledWith(2, 12);
    });

    it('treats a page that is not a whole positive number as the first page', async () => {
        const getPage = answerWith(1, 3);

        await Promise.all(
            ['?page=abc', '?page=0', '?page=-2', '?page=1.5', '?page='].map(
                (search) => callLoader(search)
            )
        );

        expect(getPage.mock.calls.map(([page]) => page)).toEqual([
            1, 1, 1, 1, 1,
        ]);
    });

    it('sends a page past the end to the last page', async () => {
        answerWith(3, 3);

        const response = (await callLoader('?page=9')) as Response;

        expect(response.status).toBe(302);
        expect(response.headers.get('Location')).toBe('/quiz?page=3');
    });

    it('sends a page whose last card was removed to the previous page', async () => {
        answerWith(2, 2);

        const response = (await callLoader('?page=3')) as Response;

        expect(response.headers.get('Location')).toBe('/quiz?page=2');
    });

    it('drops the page parameter when the collection shrinks to one page', async () => {
        answerWith(1, 1);

        const response = (await callLoader('?page=4')) as Response;

        expect(response.headers.get('Location')).toBe('/quiz');
    });

    it('keeps the other query parameters when it redirects', async () => {
        answerWith(3, 3);

        const response = (await callLoader('?sort=title&page=9')) as Response;

        expect(response.headers.get('Location')).toBe(
            '/quiz?sort=title&page=3'
        );
    });

    it('hands the empty collection through so the page can keep its copy', async () => {
        vi.spyOn(QuizService, 'getQuizzesPage').mockResolvedValue({
            message: 'return quizzes',
            payload: pageOf([], 1, 0),
        });

        const data = await callLoader();

        expect(data).toEqual(pageOf([], 1, 0));
    });
});
