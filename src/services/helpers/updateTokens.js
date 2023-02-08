import { load } from '../loader';

export const updateTokens = async () => {
    const request = {
        url: 'api/users/refresh',
        method: 'GET',
        credentials: 'include',
    };

    const response = await load(request);

    return await response.json();
};
