import { describe, expect, it } from 'vitest';
import type { Question } from '../../services/models';
import quizReducer, {
    nextQuestion,
    prevQuestion,
    restart,
    selectQuestion,
    setQuiz,
} from './quiz';

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

const quizPayload = {
    title: 'Anatomy',
    questions: [makeQuestion('q1'), makeQuestion('q2')],
};

const startQuiz = () => quizReducer(undefined, setQuiz(quizPayload));

describe('setQuiz', () => {
    it('starts on the first question', () => {
        const state = startQuiz();

        expect(state.title).toBe('Anatomy');
        expect(state.currentQuestionIndex).toBe(0);
        expect(state.currentQuestion?._id).toBe('q1');
        expect(state.correctAnswers).toEqual(['q1-a']);
    });

    it('drops the previous attempt when a new quiz loads', () => {
        const answered = quizReducer(
            startQuiz(),
            selectQuestion({ id: 'q1-a' })
        );

        const replaced = quizReducer(
            answered,
            setQuiz({ title: 'Physiology', questions: [makeQuestion('q3')] })
        );

        expect(replaced.history).toEqual([]);
        expect(replaced.currentAnswers).toEqual([]);
        expect(replaced.submission).toBeNull();
        expect(replaced.stats).toBeNull();
        expect(replaced.currentQuestion?._id).toBe('q3');
    });
});

describe('selectQuestion', () => {
    it('adds a selection and records it against the current question', () => {
        const state = quizReducer(startQuiz(), selectQuestion({ id: 'q1-b' }));

        expect(state.currentAnswers).toEqual(['q1-b']);
        expect(state.history).toEqual([{ id: 'q1', currentAnswers: ['q1-b'] }]);
    });

    it('removes a selection that is clicked again', () => {
        const selected = quizReducer(
            startQuiz(),
            selectQuestion({ id: 'q1-b' })
        );

        const deselected = quizReducer(
            selected,
            selectQuestion({ id: 'q1-b' })
        );

        expect(deselected.currentAnswers).toEqual([]);
        expect(deselected.history).toEqual([{ id: 'q1', currentAnswers: [] }]);
    });
});

describe('navigation', () => {
    it('advances to the next question and keeps the previous answers', () => {
        const answered = quizReducer(
            startQuiz(),
            selectQuestion({ id: 'q1-a' })
        );

        const next = quizReducer(answered, nextQuestion());

        expect(next.currentQuestionIndex).toBe(1);
        expect(next.currentQuestion?._id).toBe('q2');
        expect(next.currentAnswers).toEqual([]);
        expect(next.correctAnswers).toEqual(['q2-a']);
        expect(next.history[0]).toEqual({
            id: 'q1',
            currentAnswers: ['q1-a'],
        });
    });

    it('goes back to the previous question with its answers restored', () => {
        const answeredFirst = quizReducer(
            startQuiz(),
            selectQuestion({ id: 'q1-a' })
        );
        const onSecond = quizReducer(answeredFirst, nextQuestion());
        const answeredSecond = quizReducer(
            onSecond,
            selectQuestion({ id: 'q2-b' })
        );

        const back = quizReducer(answeredSecond, prevQuestion());

        expect(back.currentQuestionIndex).toBe(0);
        expect(back.currentQuestion?._id).toBe('q1');
        expect(back.currentAnswers).toEqual(['q1-a']);
        expect(back.correctAnswers).toEqual(['q1-a']);
        expect(back.history[1]).toEqual({
            id: 'q2',
            currentAnswers: ['q2-b'],
        });
    });

    it('restores the second question answers when moving forward again', () => {
        const answeredFirst = quizReducer(
            startQuiz(),
            selectQuestion({ id: 'q1-a' })
        );
        const onSecond = quizReducer(answeredFirst, nextQuestion());
        const answeredSecond = quizReducer(
            onSecond,
            selectQuestion({ id: 'q2-b' })
        );
        const back = quizReducer(answeredSecond, prevQuestion());

        const forward = quizReducer(back, nextQuestion());

        expect(forward.currentQuestionIndex).toBe(1);
        expect(forward.currentQuestion?._id).toBe('q2');
        expect(forward.currentAnswers).toEqual(['q2-b']);
    });

    it('finishes on the last question instead of advancing past it', () => {
        const onSecond = quizReducer(startQuiz(), nextQuestion());

        const finished = quizReducer(onSecond, nextQuestion());

        expect(finished.isFinished).toBe(true);
        expect(finished.currentQuestionIndex).toBe(1);
        expect(finished.currentQuestion?._id).toBe('q2');
    });
});

describe('restart', () => {
    it('resets the attempt back to the first question', () => {
        const answered = quizReducer(
            startQuiz(),
            selectQuestion({ id: 'q1-a' })
        );
        const onSecond = quizReducer(answered, nextQuestion());

        const restarted = quizReducer(onSecond, restart(quizPayload));

        expect(restarted.currentQuestionIndex).toBe(0);
        expect(restarted.currentQuestion?._id).toBe('q1');
        expect(restarted.currentAnswers).toEqual([]);
        expect(restarted.history).toEqual([]);
        expect(restarted.isFinished).toBe(false);
    });
});
