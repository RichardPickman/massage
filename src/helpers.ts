export interface QuestionWithAnswers {
    correctAnswer: string;
    incorrectAnswers: string[];
}

export const shuffleAnswers = (question: QuestionWithAnswers): string[] => {
    const unshaffledAnswers = [
        question.correctAnswer,
        ...question.incorrectAnswers,
    ];

    return unshaffledAnswers
        .map((answer) => ({ sort: Math.random(), value: answer }))
        .sort((a, b) => a.sort - b.sort)
        .map((obj) => obj.value);
};
