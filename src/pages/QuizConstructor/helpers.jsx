export const questionTemp = {
    question: '',
    img: '',
    answers: [''],
    correctAnswers: [],
    isPreview: false,
};

export const getQuestionFormData = async (data) => {
    const question = new FormData();

    for (let key of Object.keys(data)) {
        question.append(key, data[key]);
    }

    return question;
};
