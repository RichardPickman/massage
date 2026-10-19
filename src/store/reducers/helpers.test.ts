import { describe, expect, it } from 'vitest';
import type { Question } from '../../services/models';
import { buildAnswers, saveToHistory } from './helpers';
import type { QuizState } from './quiz';

const makeQuestion = (id: string): Question => ({
    _id: id,
    question: `Question ${id}`,
    answers: [
        { id: `${id}-a`, text: 'Answer A' },
        { id: `${id}-b`, text: 'Answer B' },
    ],
    correctAnswers: [`${id}-a`],
    img: null,
});

const makeState = (overrides: Partial<QuizState> = {}): QuizState => ({
    questions: [],
    title: '',
    currentQuestionIndex: 0,
    isFinished: false,
    correctAnswers: [],
    currentAnswers: [],
    history: [],
    currentQuestion: null,
    submission: null,
    isSubmitting: false,
    submitError: null,
    stats: null,
    isFetchingStats: false,
    statsError: null,
    ...overrides,
});

describe('buildAnswers', () => {
    it('keeps question order and matches selections by question id', () => {
        const state = makeState({
            questions: [makeQuestion('q1'), makeQuestion('q2')],
            history: [
                { id: 'q2', currentAnswers: ['q2-b'] },
                { id: 'q1', currentAnswers: ['q1-a', 'q1-b'] },
            ],
        });

        expect(buildAnswers(state)).toEqual([
            { questionId: 'q1', selected: ['q1-a', 'q1-b'] },
            { questionId: 'q2', selected: ['q2-b'] },
        ]);
    });

    it('sends an empty selection for a question that was never answered', () => {
        const state = makeState({
            questions: [makeQuestion('q1'), makeQuestion('q2')],
            history: [{ id: 'q1', currentAnswers: ['q1-a'] }],
        });

        expect(buildAnswers(state)).toEqual([
            { questionId: 'q1', selected: ['q1-a'] },
            { questionId: 'q2', selected: [] },
        ]);
    });
});

describe('saveToHistory', () => {
    it('appends an entry for a question that has no history yet', () => {
        const state = makeState({ questions: [makeQuestion('q1')] });

        expect(saveToHistory(state, ['q1-a'], 0)).toEqual([
            { id: 'q1', currentAnswers: ['q1-a'] },
        ]);
    });

    it('replaces the entry at the index instead of duplicating it', () => {
        const state = makeState({
            questions: [makeQuestion('q1')],
            history: [{ id: 'q1', currentAnswers: ['q1-a'] }],
        });

        expect(saveToHistory(state, ['q1-b'], 0)).toEqual([
            { id: 'q1', currentAnswers: ['q1-b'] },
        ]);
    });

    it('leaves history untouched when the index has no question', () => {
        const history = [{ id: 'q1', currentAnswers: ['q1-a'] }];
        const state = makeState({
            questions: [makeQuestion('q1')],
            history,
        });

        expect(saveToHistory(state, [], 5)).toBe(state.history);
    });
});
