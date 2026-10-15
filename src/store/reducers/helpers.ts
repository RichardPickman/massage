import type { QuizState } from './quiz';

export interface AnswerHistory {
    id: string;
    currentAnswers: string[];
}

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

export const countGrade = (state: QuizState): number => {
    const { history, questions } = state;
    let overallPoint = 0;

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const answers = history[i];

        if (!answers || question.correctAnswers.length === 0) {
            continue;
        }

        const point = 1 / question.correctAnswers.length;

        answers.currentAnswers.forEach((answerId) => {
            overallPoint += question.correctAnswers.includes(answerId)
                ? point
                : -point;
        });
    }

    return overallPoint;
};
