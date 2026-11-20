import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ImageLightbox } from '.';

const src = 'https://example.com/wide-figure.jpg';

describe('ImageLightbox', () => {
    it('opens the enlarged copy from the image itself', async () => {
        render(<ImageLightbox src={src} alt="Occlusal view" />);

        expect(
            screen.getAllByRole('img', { name: 'Occlusal view' })
        ).toHaveLength(1);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        await userEvent.click(
            screen.getByRole('button', { name: /Occlusal view/ })
        );

        // Radix hides the page behind the dialog from the a11y tree, so the
        // enlarged copy is the only image a screen reader can reach.
        const dialog = screen.getByRole('dialog');

        expect(
            within(dialog).getByRole('img', { name: 'Occlusal view' })
        ).toBeInTheDocument();
    });

    it('takes an optional trigger instead of the image', async () => {
        render(
            <ImageLightbox src={src} alt="slide.png">
                <span>slide.png</span>
            </ImageLightbox>
        );

        const trigger = screen.getByRole('button', { name: 'slide.png' });

        await userEvent.click(trigger);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes on escape, so the viewer is not a trap', async () => {
        render(<ImageLightbox src={src} alt="Occlusal view" />);

        await userEvent.click(
            screen.getByRole('button', { name: /Occlusal view/ })
        );
        await userEvent.keyboard('{Escape}');

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('keeps the inline image capped by its own class', () => {
        render(
            <ImageLightbox
                src={src}
                alt="Occlusal view"
                className="max-h-[40dvh]"
            />
        );

        expect(screen.getByRole('img', { name: 'Occlusal view' })).toHaveClass(
            'max-h-[40dvh]'
        );
    });
});
