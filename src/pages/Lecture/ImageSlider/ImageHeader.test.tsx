import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setImages } from '../../../store/reducers/images';
import { makeStore, renderWithProviders } from '../../../test/helpers';
import { ImageHeader } from './ImageHeader';

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
});
