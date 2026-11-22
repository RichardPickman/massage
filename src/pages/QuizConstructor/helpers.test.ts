import { describe, expect, it } from 'vitest';
import {
    MAX_ANSWERS,
    questionProblems,
    thresholdProblem,
    type ConstructorQuestion,
} from './helpers';

const makeQuestion = (
    overrides: Partial<ConstructorQuestion> = {}
): ConstructorQuestion => ({
    id: 'q1',
    question: 'Which muscle closes the jaw?',
    img: null,
    answers: [
        { id: 'a', text: 'Masseter' },
        { id: 'b', text: 'Orbicularis oris' },
    ],
    correctAnswers: ['a'],
    isPreview: false,
    ...overrides,
});

describe('questionProblems', () => {
    it('accepts a complete question', () => {
        expect(questionProblems(makeQuestion())).toEqual([]);
    });

    it('asks for the question text', () => {
        const problems = questionProblems(makeQuestion({ question: '   ' }));

        expect(problems).toContain('text');
    });

    it('requires two filled answers', () => {
        const problems = questionProblems(
            makeQuestion({
                answers: [
                    { id: 'a', text: 'Masseter' },
                    { id: 'b', text: '   ' },
                ],
            })
        );

        expect(problems).toContain('minAnswers');
    });

    it('requires a correct answer', () => {
        const problems = questionProblems(makeQuestion({ correctAnswers: [] }));

        expect(problems).toContain('minCorrect');
    });

    it('does not count a correct answer pointing at a dropped row', () => {
        const problems = questionProblems(
            makeQuestion({ correctAnswers: ['ghost'] })
        );

        expect(problems).toContain('minCorrect');
    });

    it('rejects more answers than the limit', () => {
        const answers = Array.from({ length: MAX_ANSWERS + 1 }, (_, index) => ({
            id: `a${index}`,
            text: `Answer ${index}`,
        }));

        const problems = questionProblems(
            makeQuestion({ answers, correctAnswers: ['a0'] })
        );

        expect(problems).toContain('maxAnswers');
    });

    it('reports every problem at once, not just the first', () => {
        const problems = questionProblems(
            makeQuestion({ question: '', correctAnswers: [] })
        );

        expect(problems.length).toBeGreaterThan(1);
    });
});

describe('thresholdProblem', () => {
    it('accepts the whole range', () => {
        expect(thresholdProblem('0')).toBeNull();
        expect(thresholdProblem('50')).toBeNull();
        expect(thresholdProblem('100')).toBeNull();
    });

    it('rejects an empty or non-numeric value', () => {
        expect(thresholdProblem('')).toBe('number');
        expect(thresholdProblem('abc')).toBe('number');
    });

    it('rejects fractions', () => {
        expect(thresholdProblem('50.5')).toBe('whole');
    });

    it('rejects out-of-range values instead of clamping', () => {
        expect(thresholdProblem('-1')).toBe('range');
        expect(thresholdProblem('101')).toBe('range');
    });
});
