import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { setImages } from '../../../store/reducers/images';
import {
    makeStore,
    renderWithProviders,
    type TestStore,
} from '../../../test/helpers';
import { MainImage } from './MainImage';

describe('MainImage', () => {
    let store: TestStore;

    beforeEach(() => {
        store = makeStore();
        store.dispatch(setImages(['one.jpg', 'two.jpg', 'three.jpg']));
    });

    it('moves between images and stops at both ends', async () => {
        const user = userEvent.setup();

        renderWithProviders(<MainImage />, { store });

        const previous = screen.getByRole('button', {
            name: 'Previous image',
        });
        const next = screen.getByRole('button', { name: 'Next image' });

        expect(previous).toBeDisabled();
        expect(
            screen.getByRole('img', { name: 'Lecture image 1' })
        ).toBeInTheDocument();

        await user.click(next);
        expect(
            screen.getByRole('img', { name: 'Lecture image 2' })
        ).toBeInTheDocument();

        await user.click(next);
        expect(next).toBeDisabled();
        expect(
            screen.getByRole('img', { name: 'Lecture image 3' })
        ).toBeInTheDocument();

        await user.click(previous);
        expect(
            screen.getByRole('img', { name: 'Lecture image 2' })
        ).toBeInTheDocument();
    });

    it('lets the photo fill the viewer instead of capping its height', () => {
        renderWithProviders(<MainImage />, { store });

        // jsdom lays nothing out, so the classes are the only guard that the
        // photo is not capped at a fraction of the viewport.
        const photo = screen.getByRole('img', { name: 'Lecture image 1' });

        expect(photo).toHaveClass('h-full', 'w-full', 'object-contain');
        expect(photo).not.toHaveClass('max-h-[85vh]');
    });
});
