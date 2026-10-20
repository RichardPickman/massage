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
});
