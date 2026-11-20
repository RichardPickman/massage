import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation, type RouteObject } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LectureService from '../../services/Lecture';
import type { Lecture } from '../../services/models';
import type { ApiResponse, Page } from '../../services/types';
import { makeStore, renderWithDataRouter, signIn } from '../../test/helpers';
import { readLectureListUrl } from '../../utils/lectureList';
import { Lectures, loader } from '.';

const lecture = (id: string): Lecture => ({
    _id: id,
    topic: `Lecture ${id}`,
    images: [],
    teacher: [],
    lesson: [],
    date: '19/10/2026',
});

const pageOf = (
    items: Lecture[],
    page: number,
    pages: number
): ApiResponse<Page<Lecture>> => ({
    message: 'return lectures',
    payload: { items, total: pages * 10, page, limit: 10, pages },
});

const routes: RouteObject[] = [
    { path: '/lectures', element: <Lectures />, loader },
];

// Stands in for the lecture viewer: it shows the page the row link carried.
const CarriedProbe = () => {
    const { state } = useLocation();

    return <p>{readLectureListUrl(state)}</p>;
};

const routesWithViewer: RouteObject[] = [
    ...routes,
    { path: '/lectures/:id', element: <CarriedProbe /> },
];

const renderLectures = (
    route = '/lectures',
    appRoutes: RouteObject[] = routes
) => {
    const store = makeStore();
    signIn(store);

    renderWithDataRouter(appRoutes, { store, route });
};

// Card list and table both render each lecture; jsdom applies no media
// queries, so take the first match.

describe('Lectures page', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('titles the page on the page, not inside a card', async () => {
        vi.spyOn(LectureService, 'getLecturesPage').mockResolvedValue(
            pageOf([lecture('one')], 1, 1)
        );

        renderLectures();

        const heading = await screen.findByRole('heading', {
            name: 'Lectures',
        });

        // A page framed in a card is what made this screen look different from
        // the overview and the quizzes list.
        expect(heading.closest('[data-slot="card"]')).toBeNull();
    });

    it('renders the rows of the page in the address', async () => {
        vi.spyOn(LectureService, 'getLecturesPage').mockResolvedValue(
            pageOf([lecture('page-2')], 2, 2)
        );

        renderLectures('/lectures?page=2');

        expect(
            (await screen.findAllByRole('link', { name: 'Lecture page-2' }))[0]
        ).toBeInTheDocument();
        expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    });

    it('opens a lecture knowing which page it came from', async () => {
        vi.spyOn(LectureService, 'getLecturesPage').mockResolvedValue(
            pageOf([lecture('page-2')], 2, 2)
        );

        renderLectures('/lectures?page=2', routesWithViewer);

        await userEvent.click(
            (
                await screen.findAllByRole('link', { name: 'Lecture page-2' })
            )[0]
        );

        expect(await screen.findByText('/lectures?page=2')).toBeInTheDocument();
    });

    it('keeps the empty copy when there are no lectures', async () => {
        vi.spyOn(LectureService, 'getLecturesPage').mockResolvedValue(
            pageOf([], 1, 0)
        );

        renderLectures();

        expect(
            await screen.findByText('There are no lectures yet.')
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('navigation', { name: 'pagination' })
        ).not.toBeInTheDocument();
    });

    it('hides the controls when the collection fits on one page', async () => {
        vi.spyOn(LectureService, 'getLecturesPage').mockResolvedValue(
            pageOf([lecture('only')], 1, 1)
        );

        renderLectures();

        expect(
            (await screen.findAllByRole('link', { name: 'Lecture only' }))[0]
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('navigation', { name: 'pagination' })
        ).not.toBeInTheDocument();
    });

    it('lands on the previous page when the last row on the last page is removed', async () => {
        let removed = false;

        const getPage = vi
            .spyOn(LectureService, 'getLecturesPage')
            .mockImplementation(() =>
                // Ten rows are left once the only row on page two is gone, so
                // the backend answers any request for page two with page one.
                Promise.resolve(
                    removed
                        ? pageOf([lecture('page-1')], 1, 1)
                        : pageOf([lecture('page-2')], 2, 2)
                )
            );

        vi.spyOn(LectureService, 'removeLecture').mockImplementation(() => {
            removed = true;

            return Promise.resolve({
                message: 'Removed successfully',
                payload: lecture('page-2'),
            });
        });

        renderLectures('/lectures?page=2');

        await userEvent.click(
            (
                await screen.findAllByRole('button', {
                    name: 'Remove Lecture page-2',
                })
            )[0]
        );
        await userEvent.click(
            screen.getAllByRole('button', { name: 'Remove' })[0]
        );

        expect(
            (await screen.findAllByRole('link', { name: 'Lecture page-1' }))[0]
        ).toBeInTheDocument();
        expect(screen.queryByText('Page 2 of 2')).not.toBeInTheDocument();
        expect(getPage).toHaveBeenLastCalledWith(1, 10);
    });
});
