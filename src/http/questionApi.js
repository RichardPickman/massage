import { $authHost, $host } from './index';

export const createQuestion = async (data) => {
    const response = await $host.post('api/question/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response;
};

export const getQuestion = async (id) => {
    const response = await $host.get(`api/question/${id}`);

    return response;
};

export const fetchUpdateQuestion = async (id, data) => {
    const response = await $host.post(`api/question/update/${id}`, data);

    return response;
};

export const removeQuestion = async (id) => {
    const response = await $authHost.get(`api/question/remove/${id}`);

    return response;
};
