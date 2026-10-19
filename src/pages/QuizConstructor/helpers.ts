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

export const questionTemp: Omit<ConstructorQuestion, 'id'> = {
    question: '',
    img: null,
    answers: [getObjectWithId({ text: '' })],
    correctAnswers: [],
    isPreview: false,
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

