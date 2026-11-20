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
export const questionProblems = (question: ConstructorQuestion): string[] => {
    const problems: string[] = [];
    const filledAnswers = question.answers.filter((answer) =>
        answer.text.trim()
    );
    const correct = question.correctAnswers.filter((id) =>
        filledAnswers.some((answer) => answer.id === id)
    );

    if (!question.question.trim()) {
        problems.push('Add the question text');
    }

    if (filledAnswers.length < MIN_ANSWERS) {
        problems.push(`Fill at least ${MIN_ANSWERS} answers`);
    }

    if (filledAnswers.length > MAX_ANSWERS) {
        problems.push(`No more than ${MAX_ANSWERS} answers`);
    }

    if (correct.length < MIN_CORRECT) {
        problems.push('Mark at least one correct answer');
    }

    if (correct.length > MAX_CORRECT) {
        problems.push(`No more than ${MAX_CORRECT} correct answers`);
    }

    return problems;
};

export const thresholdProblem = (raw: string): string | null => {
    const value = Number(raw.trim());

    if (!raw.trim() || !Number.isFinite(value)) {
        return 'Threshold must be a number';
    }

    if (!Number.isInteger(value)) {
        return 'Threshold must be a whole number';
    }

    if (value < 0 || value > 100) {
        return 'Threshold must be between 0 and 100';
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
