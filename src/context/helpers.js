export const saveToHistory = (state, currentAnswers, index) => {
    const prevQuestion = state.questions[index];
    const saveHistoryCopy = [...state.history];
    const isExist = !!saveHistoryCopy[index];

    if (isExist) {
        saveHistoryCopy[index] = {
            id: prevQuestion._id,
            currentAnswers,
        };

        return saveHistoryCopy;
    }

    const result = [
        ...saveHistoryCopy,
        {
            id: prevQuestion._id,
            currentAnswers,
        },
    ];

    return result;
};

export const countGrade = (state) => {
    const { history, questions } = state;
    let overallPoint = 0;

    for (let i = 0; i < questions.length; i++) {
        const point = 1 / questions[i].correctAnswers.length;
        const question = questions[i];
        const answers = history[i];

        answers.currentAnswers.forEach((ans) => {
            if (question.correctAnswers.includes(ans)) {
                overallPoint += point;
            } else {
                overallPoint -= point;
            }
        });
    }

    return overallPoint;
};
