import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { setImages } from '../../../store/reducers/images';
import { makeStore, renderWithProviders } from '../../../test/helpers';
import { ImageHeader } from './ImageHeader';

// Stands in for the lectures list: it shows the address it was landed on.
const ListProbe = () => {
    const { pathname, search } = useLocation();

    return <p>{`${pathname}${search}`}</p>;
};

const viewerRoutes = (
    <Routes>
        <Route
            path="/lectures/:id"
            element={
                <ImageHeader
                    isFullscreen={false}
                    onToggleFullscreen={vi.fn()}
                />
            }
        />
        <Route path="/lectures" element={<ListProbe />} />
    </Routes>
);

const renderViewer = (state?: unknown) => {
    const store = makeStore();

    store.dispatch(setImages(['one.jpg']));

    renderWithProviders(viewerRoutes, {
        store,
        route: { pathname: '/lectures/lecture-1', state },
    });
};

describe('ImageHeader', () => {
    it('asks to enter fullscreen while windowed', async () => {
        const user = userEvent.setup();
        const store = makeStore();
        const onToggleFullscreen = vi.fn();

        store.dispatch(setImages(['one.jpg']));

        renderWithProviders(
            <ImageHeader
                isFullscreen={false}
                onToggleFullscreen={onToggleFullscreen}
            />,
            { store }
        );

        expect(screen.getByText('1 / 1')).toBeInTheDocument();

        await user.click(
            screen.getByRole('button', { name: 'View in fullscreen' })
        );

        expect(onToggleFullscreen).toHaveBeenCalledTimes(1);
    });

    it('offers the exit action while fullscreen', () => {
        const store = makeStore();

        store.dispatch(setImages(['one.jpg']));

        renderWithProviders(
            <ImageHeader isFullscreen onToggleFullscreen={() => {}} />,
            { store }
        );

        expect(
            screen.getByRole('button', { name: 'Exit fullscreen' })
        ).toBeInTheDocument();
    });

    it('closes back to the page the lecture was opened from', async () => {
        const user = userEvent.setup();

        renderViewer({ listUrl: '/lectures?page=3' });

        await user.click(
            screen.getByRole('button', { name: 'Close the slider' })
        );

        expect(await screen.findByText('/lectures?page=3')).toBeInTheDocument();
    });

    it('closes to the first page when nothing was carried', async () => {
        const user = userEvent.setup();

        renderViewer();

        await user.click(
            screen.getByRole('button', { name: 'Close the slider' })
        );

        expect(await screen.findByText('/lectures')).toBeInTheDocument();
    });

    it('closes to the first page when the carried state is malformed', async () => {
        const user = userEvent.setup();

        renderViewer({ listUrl: '/quiz?page=2' });

        await user.click(
            screen.getByRole('button', { name: 'Close the slider' })
        );

        expect(await screen.findByText('/lectures')).toBeInTheDocument();
    });
});
