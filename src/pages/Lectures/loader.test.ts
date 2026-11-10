import type { LoaderFunctionArgs } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LectureService from '../../services/Lecture';
import type { Lecture } from '../../services/models';
import type { Page } from '../../services/types';
import { loader } from '.';

const lecture = (id: string): Lecture => ({
    _id: id,
    topic: `Lecture ${id}`,
    images: [],
    teacher: [],
    lesson: [],
    date: '19/10/2026',
});

const pageOf = (page: number, pages: number): Page<Lecture> => ({
    items: [lecture(`page-${page}`)],
    total: pages * 10,
    page,
    limit: 10,
    pages,
});

const answerWith = (page: number, pages: number) =>
    vi.spyOn(LectureService, 'getLecturesPage').mockResolvedValue({
        message: 'return lectures',
        payload: pageOf(page, pages),
    });

const callLoader = (search = '') =>
    loader({
        request: new Request(`http://localhost/lectures${search}`),
    } as LoaderFunctionArgs);

describe('lectures loader', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('reads the first page when the address carries no page', async () => {
        const getPage = answerWith(1, 3);

        const data = await callLoader();

        expect(getPage).toHaveBeenCalledWith(1, 10);
        expect(data).toEqual({
            rows: [
                {
                    id: 'page-1',
                    topic: 'Lecture page-1',
                    lesson: '',
                    teacher: '',
                    date: '19/10/2026',
                },
            ],
            page: 1,
            pages: 3,
        });
    });

    it('asks for the page the address names', async () => {
        const getPage = answerWith(2, 3);

        await callLoader('?page=2');

        expect(getPage).toHaveBeenCalledWith(2, 10);
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
        expect(response.headers.get('Location')).toBe('/lectures?page=3');
    });

    it('sends a page whose last row was removed to the previous page', async () => {
        answerWith(2, 2);

        const response = (await callLoader('?page=3')) as Response;

        expect(response.headers.get('Location')).toBe('/lectures?page=2');
    });

    it('drops the page parameter when the collection shrinks to one page', async () => {
        answerWith(1, 1);

        const response = (await callLoader('?page=4')) as Response;

        expect(response.headers.get('Location')).toBe('/lectures');
    });

    it('keeps the other query parameters when it redirects', async () => {
        answerWith(3, 3);

        const response = (await callLoader('?sort=topic&page=9')) as Response;

        expect(response.headers.get('Location')).toBe(
            '/lectures?sort=topic&page=3'
        );
    });
});
