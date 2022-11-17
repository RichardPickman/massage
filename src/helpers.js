export const shuffleAnswers = (question) => {
    const unshaffledAnswers = [
        question.correctAnswer,
        ...question.incorrectAnswers,
    ];

    return unshaffledAnswers
        .map((answer) => ({ sort: Math.random(), value: answer }))
        .sort((a, b) => a.sort - b.sort)
        .map((obj) => obj.value);
};
