import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { handleMenus, setImages } from '../../../store/reducers/images';
import { makeStore, renderWithProviders } from '../../../test/helpers';
import { ImageFooter } from './ImageFooter';

const renderFooter = () => {
    const store = makeStore();

    store.dispatch(setImages(['one.jpg', 'two.jpg']));

    return { store, ...renderWithProviders(<ImageFooter />, { store }) };
};

describe('ImageFooter', () => {
    it('lists every slide and marks the current one', () => {
        renderFooter();

        expect(screen.getByRole('img', { name: 'Slide 1' })).toHaveClass(
            'opacity-100'
        );
        expect(screen.getByRole('img', { name: 'Slide 2' })).toHaveClass(
            'opacity-50'
        );
    });

    it('jumps to the slide that was tapped', async () => {
        const { store } = renderFooter();

        await userEvent.click(screen.getByRole('img', { name: 'Slide 2' }));

        expect(store.getState().images.currentIndex).toBe(1);
        expect(store.getState().images.currentImage).toBe('two.jpg');
    });

    it('keeps the strip clear of the home indicator', () => {
        renderFooter();

        // jsdom computes no layout, so the safe-area padding is asserted as a
        // class: without it the strip sits under the home indicator.
        expect(
            screen.getByRole('img', { name: 'Slide 1' }).parentElement
        ).toHaveClass('pb-[calc(0.5rem+env(safe-area-inset-bottom))]');
    });

    it('renders nothing when the viewer hides its menus', () => {
        const store = makeStore();

        store.dispatch(setImages(['one.jpg']));
        store.dispatch(handleMenus(false));

        renderWithProviders(<ImageFooter />, { store });

        expect(
            screen.queryByRole('img', { name: 'Slide 1' })
        ).not.toBeInTheDocument();
    });
});
