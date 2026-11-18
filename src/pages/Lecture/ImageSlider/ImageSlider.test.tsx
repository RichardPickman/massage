import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { setImages } from '../../../store/reducers/images';
import { makeStore, renderWithProviders } from '../../../test/helpers';
import { ImageSlider } from '.';

// Stands in for the lectures list: it shows the address it was landed on.
const ListProbe = () => {
    const { pathname, search } = useLocation();

    return <p>{`${pathname}${search}`}</p>;
};

const sliderRoutes = (
    <Routes>
        <Route path="/lectures/:id" element={<ImageSlider />} />
        <Route path="/lectures" element={<ListProbe />} />
    </Routes>
);

const renderSlider = (state?: unknown) => {
    const store = makeStore();

    store.dispatch(setImages(['one.jpg']));

    return renderWithProviders(sliderRoutes, {
        store,
        route: { pathname: '/lectures/lecture-1', state },
    });
};

describe('ImageSlider', () => {
    it('closes back to the page the lecture was opened from when Escape is pressed', async () => {
        renderSlider({ listUrl: '/lectures?page=3' });

        await userEvent.keyboard('{Escape}');

        expect(await screen.findByText('/lectures?page=3')).toBeInTheDocument();
    });

    it('closes to the first page when nothing was carried', async () => {
        renderSlider();

        await userEvent.keyboard('{Escape}');

        expect(await screen.findByText('/lectures')).toBeInTheDocument();
    });

    it('is sized against the visible viewport rather than the document', () => {
        renderSlider();

        // jsdom lays nothing out, so the classes stand in for the geometry:
        // dynamic viewport units keep browser chrome from overlapping the
        // viewer, and overscroll keeps the gesture from chaining to the page.
        const viewer = document.querySelector('[aria-label="Lecture images"]');

        expect(viewer).toHaveClass('fixed', 'h-dvh', 'overscroll-none');
    });

    it('holds the page still while it is open and gives it back on close', () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        const { unmount } = renderSlider();

        expect(document.body.style.overflow).toBe('hidden');
        expect(document.documentElement.style.overflow).toBe('hidden');

        unmount();

        expect(document.body.style.overflow).toBe('');
        expect(document.documentElement.style.overflow).toBe('');
    });

    it('restores scroll it found already set by something else', () => {
        document.body.style.overflow = 'scroll';

        const { unmount } = renderSlider();

        expect(document.body.style.overflow).toBe('hidden');

        unmount();

        expect(document.body.style.overflow).toBe('scroll');

        document.body.style.overflow = '';
    });
});
