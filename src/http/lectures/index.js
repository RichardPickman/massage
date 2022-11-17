import { $authHost, $host } from '../index';

export const createLecture = async (payload) => {
    const response = await $host.post('api/lectures/create', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response;
};

export const getLecture = async (id) => {
    const response = await $host.get(`api/lectures/${id}`);

    return response;
};

export const getAllLectures = async () => {
    const response = await $host.get('api/lectures/all');

    return response;
};

export const removeLecture = async () => {
    const response = await $authHost.post('api/lectures/remove/');

    return response;
};
