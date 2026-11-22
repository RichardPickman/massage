import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AnswerButtonState } from '.';
import { ButtonHandler } from '.';

const longText =
    'Nawiercenie zęba do momentu uzyskania dostępu do miazgi komorowej, z zachowaniem twardych tkanek na obwodzie ubytku';

const makeState = (
    overrides: Partial<AnswerButtonState> = {}
): AnswerButtonState => ({
    answer: { id: 'a1', text: longText },
    correctAnswers: ['a1'],
    currentAnswers: ['a1'],
    isFinished: false,
    showAnswers: false,
    onSelect: () => {},
    ...overrides,
});

describe('ButtonHandler answer rows', () => {
    it('wraps the text while the quiz is being taken', () => {
        render(<ButtonHandler state={makeState()} />);

        expect(screen.getByRole('button', { name: longText })).toHaveClass(
            'whitespace-normal',
            'h-auto',
            'min-w-0'
        );
    });

    it('wraps the text in every review variant', () => {
        const variants: Partial<AnswerButtonState>[] = [
            // correct, picked
            { isFinished: true },
            // correct, not picked
            { isFinished: true, currentAnswers: [] },
            // wrong, picked
            { isFinished: true, correctAnswers: ['other'] },
            // wrong, not picked
            { isFinished: true, correctAnswers: ['other'], currentAnswers: [] },
        ];

        for (const variant of variants) {
            const { unmount } = render(
                <ButtonHandler state={makeState(variant)} />
            );

            // A nowrap row grew past the grid cell and dragged the whole page
            // wider than the phone screen - this is the backlog regression.
            expect(screen.getByRole('button', { name: longText })).toHaveClass(
                'whitespace-normal',
                'h-auto',
                'min-w-0'
            );

            unmount();
        }
    });

    it('wraps the text when the key is shown', () => {
        render(<ButtonHandler state={makeState({ showAnswers: true })} />);

        expect(screen.getByRole('button', { name: longText })).toHaveClass(
            'whitespace-normal',
            'h-auto',
            'min-w-0'
        );
    });
});
