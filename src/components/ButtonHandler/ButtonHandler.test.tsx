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

// A review row also carries the sr-only verdict in its accessible name, so the
// name starts with the answer text rather than equalling it.
const rowFor = (text: string) =>
    screen.getByRole('button', {
        name: new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
    });

describe('ButtonHandler answer rows', () => {
    it('wraps the text while the quiz is being taken', () => {
        render(<ButtonHandler state={makeState()} />);

        expect(rowFor(longText)).toHaveClass(
            'whitespace-normal',
            'h-auto',
            'min-w-0'
        );
    });

    it('sets an answer the way content is set, not like a label', () => {
        render(<ButtonHandler state={makeState()} />);

        // The button base is uppercase with wide letter spacing; at 16px a
        // Polish sentence in capitals reads letter by letter.
        expect(rowFor(longText)).toHaveClass(
            'normal-case',
            'tracking-normal',
            'text-[0.9375rem]'
        );
    });

    it('tells a screen reader which answer is chosen', () => {
        render(<ButtonHandler state={makeState()} />);

        expect(rowFor(longText)).toHaveAttribute('aria-pressed', 'true');
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
            expect(rowFor(longText)).toHaveClass(
                'whitespace-normal',
                'h-auto',
                'min-w-0'
            );

            unmount();
        }
    });

    it('wraps the text when the key is shown', () => {
        render(<ButtonHandler state={makeState({ showAnswers: true })} />);

        expect(rowFor(longText)).toHaveClass(
            'whitespace-normal',
            'h-auto',
            'min-w-0'
        );
    });

    it('names the verdict instead of leaving it to colour', () => {
        render(<ButtonHandler state={makeState({ isFinished: true })} />);

        // Colour alone says nothing to a screen reader and not enough to a
        // colour-blind student.
        expect(rowFor(longText)).toHaveTextContent(/Correct answer/);
        expect(rowFor(longText)).toHaveAttribute('tabindex', '-1');
    });

    it('marks a wrongly chosen answer as wrong in words', () => {
        render(
            <ButtonHandler
                state={makeState({
                    isFinished: true,
                    correctAnswers: ['other'],
                })}
            />
        );

        expect(rowFor(longText)).toHaveTextContent(/Wrong answer/);
    });
});
