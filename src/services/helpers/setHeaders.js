export const setHeaders = (headers) => {
    const token = localStorage.getItem('token');

    return {
        ...headers,
        Authorization: token,
    };
};
