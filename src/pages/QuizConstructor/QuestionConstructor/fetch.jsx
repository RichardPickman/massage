import { fetchUpdateQuestion } from '../../../http/questionApi';
import { getQuestionFormData } from '../helpers';

export const fetchAnswers = async (answer, answerId, answers, questionId) => {
    const getForm = {
        answers: answers.map((text, index) =>
            index === answerId ? answer : text
        ),
    };

    const fetch = await fetchUpdateQuestion(questionId, getForm);

    return fetch.data.payload;
};

export const fetchCorrectAnswers = async (
    correctAnswers,
    index,
    questionId
) => {
    const isExist = correctAnswers.includes(index);
    const correctAnswersCopy = isExist
        ? correctAnswers.filter((item) => item !== index)
        : [...correctAnswers, index];

    const fetch = await fetchUpdateQuestion(questionId, {
        correctAnswers: correctAnswersCopy,
    });

    return fetch.data.payload;
};

export const fetchImage = async (files, questionId) => {
    const getForm = await getQuestionFormData({
        img: files[0],
    });

    const fetch = await fetchUpdateQuestion(questionId, getForm);

    return fetch.data.payload;
};

export const fetchQuestion = async (event, questionId) => {
    const fetch = await fetchUpdateQuestion(questionId, {
        question: event.target.value,
    });

    return fetch.data.payload;
};
