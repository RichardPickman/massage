import { $authHost, $host } from './index';

export const createQuiz = async (data) => {
    const response = await $host.post('api/quiz/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response;
};

export const updateQuiz = async (id, questions, title) => {
    const response = await $host.post('api/quiz/update/:id', {
        id,
        questions,
        title,
    });

    return response;
};

export const getQuiz = async (id) => {
    const response = await $host.post('api/quiz/:id', { id });

    return response;
};

export const getAllQuizzes = async () => {
    const response = await $host.post('api/quiz/all');

    return response;
};

export const removeQuiz = async () => {
    const response = await $authHost.get('api/quiz/remove/');

    return response;
};
