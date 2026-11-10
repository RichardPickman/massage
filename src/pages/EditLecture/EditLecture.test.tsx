import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation, type RouteObject } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LectureService from '../../services/Lecture';
import type { LectureDetails } from '../../services/models';
import {
    makeStore,
    renderWithDataRouter,
    signIn,
    type TestRoute,
} from '../../test/helpers';
import { readLectureListUrl } from '../../utils/lectureList';
import { EditLecture } from '.';

const lecture: LectureDetails = {
    _id: 'lecture-1',
    topic: 'Anatomy',
    images: ['https://example.com/one.jpg'],
    imageKeys: ['one.jpg'],
    teacher: ['Czerwińska'],
    lesson: ['Ortodoncja'],
    date: '19/10/2026',
    author: 'user-1',
};

// Stands in for the lectures list: it shows the address it was landed on.
const ListProbe = () => {
    const { pathname, search } = useLocation();

    return <p>{`${pathname}${search}`}</p>;
};

// Stands in for the lecture viewer: it shows the page the save carried.
const CarriedProbe = () => {
    const { state } = useLocation();

    return <p>{readLectureListUrl(state)}</p>;
};

const routes: RouteObject[] = [
    { path: '/lectures', element: <ListProbe /> },
    {
        path: '/lectures/:id/edit',
        element: <EditLecture />,
        loader: () => lecture,
    },
    { path: '/lectures/:id', element: <CarriedProbe /> },
];

const renderEdit = (route: TestRoute, isSignedIn = true) => {
    const store = makeStore();

    if (isSignedIn) {
        signIn(store);
    }

    renderWithDataRouter(routes, { store, route });
};

describe('EditLecture page', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('offers a way back to the page the lecture was opened from', async () => {
        renderEdit({
            pathname: '/lectures/lecture-1/edit',
            state: { listUrl: '/lectures?page=3' },
        });

        expect(
            await screen.findByRole('link', { name: 'Cancel' })
        ).toHaveAttribute('href', '/lectures?page=3');
    });

    it('sends a visitor who cannot manage the lecture to that page', async () => {
        renderEdit(
            {
                pathname: '/lectures/lecture-1/edit',
                state: { listUrl: '/lectures?page=3' },
            },
            false
        );

        expect(await screen.findByText('/lectures?page=3')).toBeInTheDocument();
    });

    it('sends a visitor who cannot manage the lecture to the first page without carried state', async () => {
        renderEdit({ pathname: '/lectures/lecture-1/edit' }, false);

        expect(await screen.findByText('/lectures')).toBeInTheDocument();
    });

    it('opens the saved lecture with that page still carried', async () => {
        vi.spyOn(LectureService, 'updateLecture').mockResolvedValue({
            message: 'Updated successfully',
            payload: lecture,
        });

        renderEdit({
            pathname: '/lectures/lecture-1/edit',
            state: { listUrl: '/lectures?page=3' },
        });

        await userEvent.click(
            await screen.findByRole('button', { name: 'Save changes' })
        );

        expect(await screen.findByText('/lectures?page=3')).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'Save changes' })
        ).toBeNull();
    });
});
