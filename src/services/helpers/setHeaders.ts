import { getToken } from './token';

export const setHeaders = (headers?: Record<string, string>) => {
    const token = getToken();
    const result: Record<string, string> = { ...headers };

    if (token) {
        result.Authorization = token;
    }

    return result;
};
