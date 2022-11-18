export const questionTemp = {
    question: '',
    img: null,
    answers: [''],
    correctAnswers: [],
    isPreview: false,
};

export const getQuestionFormData = async (data) => {
    const question = new FormData();

    for (let key of Object.keys(data)) {
        if (key === 'correctAnswers') {
            for (let i = 0; i < data.correctAnswers.length; i++) {
                question.append('correctAnswers', data.correctAnswers[i]);
            }
        } else if (key === 'answers') {
            for (let i = 0; i < data.answers.length; i++) {
                question.append('answers', data.answers[i]);
            }
        } else {
            console.log(key, data[key]);
            question.append(key, data[key]);
        }
    }

    return question;
};
