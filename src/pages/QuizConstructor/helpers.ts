import { nanoid } from '@reduxjs/toolkit';
import type { Answer } from '../../services/models';

export interface ConstructorQuestion {
    id: string;
    question: string;
    img: File | null;
    answers: Answer[];
    correctAnswers: string[];
    isPreview: boolean;
}

export interface QuestionFormValues {
    question: string;
    img: File | null;
    answers: Answer[];
    correctAnswers: string[];
}

export const getObjectWithId = <T extends object>(data: T) => ({
    id: nanoid(),
    ...data,
});

// Limits agreed for the editor: a question needs at least two options to be a
// question at all, and more than ten is a wall of text on a phone - that case is
// several questions, not one.
export const MIN_ANSWERS = 2;
export const MAX_ANSWERS = 10;
export const MIN_CORRECT = 1;
export const MAX_CORRECT = 10;
export const DEFAULT_THRESHOLD = 50;

export const questionTemp: Omit<ConstructorQuestion, 'id'> = {
    question: '',
    img: null,
    answers: [getObjectWithId({ text: '' }), getObjectWithId({ text: '' })],
    correctAnswers: [],
    isPreview: false,
};

// Problems are reported per card, and the same list is what the save button
// blocks on: one rule set, so a card can never look fine and still be rejected.
// They travel as codes, not sentences: the card renders them in the reader's
// language, and a string held in state would stay in the language it was built
// in after a switch.
export type QuestionProblem =
    | 'text'
    | 'minAnswers'
    | 'maxAnswers'
    | 'minCorrect'
    | 'maxCorrect';

export const questionProblems = (
    question: ConstructorQuestion
): QuestionProblem[] => {
    const problems: QuestionProblem[] = [];
    const filledAnswers = question.answers.filter((answer) =>
        answer.text.trim()
    );
    const correct = question.correctAnswers.filter((id) =>
        filledAnswers.some((answer) => answer.id === id)
    );

    if (!question.question.trim()) {
        problems.push('text');
    }

    if (filledAnswers.length < MIN_ANSWERS) {
        problems.push('minAnswers');
    }

    if (filledAnswers.length > MAX_ANSWERS) {
        problems.push('maxAnswers');
    }

    if (correct.length < MIN_CORRECT) {
        problems.push('minCorrect');
    }

    if (correct.length > MAX_CORRECT) {
        problems.push('maxCorrect');
    }

    return problems;
};

export type ThresholdProblem = 'number' | 'whole' | 'range';

export const thresholdProblem = (raw: string): ThresholdProblem | null => {
    const value = Number(raw.trim());

    if (!raw.trim() || !Number.isFinite(value)) {
        return 'number';
    }

    if (!Number.isInteger(value)) {
        return 'whole';
    }

    if (value < 0 || value > 100) {
        return 'range';
    }

    return null;
};

export const getQuestionFormData = (values: QuestionFormValues) => {
    const question = new FormData();

    question.append('question', values.question);

    for (const answer of values.answers) {
        question.append('answers', JSON.stringify(answer));
    }

    for (const answerId of values.correctAnswers) {
        question.append('correctAnswers', answerId);
    }

    if (values.img instanceof File) {
        question.append('img', values.img);
    }

    return question;
};

// The API JSON.parses every `answers` entry and rejects a question without any,
// so blank rows and correct answers pointing at dropped rows are filtered out.
export const prepareQuestion = (question: ConstructorQuestion) => {
    const answers = question.answers.filter((answer) => answer.text.trim());
    const answerIds = answers.map((answer) => answer.id);

    return getQuestionFormData({
        question: question.question,
        img: question.img,
        answers,
        correctAnswers: question.correctAnswers.filter((id) =>
            answerIds.includes(id)
        ),
    });
};
