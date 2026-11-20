import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeStore, renderWithProviders } from '../../test/helpers';
import { Question } from '.';

const renderQuestion = (img: string | null, onSelect = () => {}) =>
    renderWithProviders(
        <Question
            currentQuestion={{
                question: 'Which muscle flexes the elbow?',
                answers: [
                    { id: 'a1', text: 'Biceps brachii' },
                    { id: 'a2', text: 'Triceps brachii' },
                ],
                correctAnswers: ['a1'],
                img,
            }}
            currentState={{
                correctAnswers: [],
                currentAnswers: [],
                isFinished: false,
                showAnswers: false,
            }}
            onSelect={onSelect}
        />,
        { store: makeStore() }
    );

describe('Question', () => {
    it('caps the figure against the viewport so the answers stay on screen', () => {
        renderQuestion('https://example.com/figure.jpg');

        // jsdom lays nothing out, so the classes are the guard: a fixed pixel
        // cap pushed the answers off a phone screen once the figure loaded.
        // The alt now names the question, and the image is wrapped in the zoom
        // trigger, so it is found by its own accessible name.
        const figure = screen.getByRole('img', {
            name: 'Which muscle flexes the elbow?',
        });

        expect(figure).toHaveClass('max-h-[40dvh]', 'object-contain');
        expect(figure).not.toHaveClass('max-h-96');
    });

    it('leaves the question text alone when there is no figure', () => {
        renderQuestion(null);

        expect(
            screen.queryByRole('img', { name: 'Question' })
        ).not.toBeInTheDocument();
        expect(
            screen.getByText('Which muscle flexes the elbow?')
        ).toBeInTheDocument();
    });

    it('reports which answer was picked', async () => {
        const onSelect = vi.fn();

        renderQuestion(null, onSelect);

        await userEvent.click(
            screen.getByRole('button', { name: 'Triceps brachii' })
        );

        expect(onSelect).toHaveBeenCalledWith('a2');
    });
});
