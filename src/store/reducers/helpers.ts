import type { SubmittedAnswer } from '../../services/types';
import type { QuizState } from './quiz';

export interface AnswerHistory {
    id: string;
    currentAnswers: string[];
}

// The payload the server grades: every question, with whatever was selected.
export const buildAnswers = (state: QuizState): SubmittedAnswer[] =>
    state.questions.map((question) => {
        const entry = state.history.find((snap) => snap.id === question._id);

        return {
            questionId: question._id,
            selected: entry ? entry.currentAnswers : [],
        };
    });

export const saveToHistory = (
    state: QuizState,
    currentAnswers: string[],
    index: number
): AnswerHistory[] => {
    const question = state.questions[index];

    if (!question) {
        return state.history;
    }

    const saveHistoryCopy = [...state.history];
    const isExist = !!saveHistoryCopy[index];

    if (isExist) {
        saveHistoryCopy[index] = {
            id: question._id,
            currentAnswers,
        };

        return saveHistoryCopy;
    }

    return [
        ...saveHistoryCopy,
        {
            id: question._id,
            currentAnswers,
        },
    ];
};
