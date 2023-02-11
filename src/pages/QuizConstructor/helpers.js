import { v4 } from 'uuid';

export const getObjectWithId = (data) => ({ id: v4(), ...data });

export const questionTemp = {
    question: '',
    img: null,
    answers: [getObjectWithId({ text: '' })],
    correctAnswers: [],
    isPreview: false,
};

export const getQuestionFormData = (data) => {
    const question = new FormData();

    for (let key of Object.keys(data)) {
        if (key === 'correctAnswers') {
            for (let i = 0; i < data.correctAnswers.length; i++) {
                question.append('correctAnswers', data.correctAnswers[i]);
            }
        } else if (key === 'answers') {
            for (let i = 0; i < data.answers.length; i++) {
                question.append('answers', JSON.stringify(data.answers[i]));
            }
        } else {
            question.append(key, data[key]);
        }
    }

    return question;
};

export const prepareQuestion = (question) => {
    const notBlankAnswers = question.answers.filter((answer) => answer.text);

    const { id: _, isPreview: __, ...fields } = question;

    const properQuestion = {
        ...fields,
        answers: notBlankAnswers,
    };

    const form = getQuestionFormData(properQuestion);

    return form;
};
