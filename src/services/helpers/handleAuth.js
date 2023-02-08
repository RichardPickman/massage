import { load } from '../loader';
import { updateTokens } from './updateTokens';

export const handleAuth = async (request) => {
    if (!request._isRetry) {
        try {
            const newTokens = await updateTokens();

            localStorage.setItem('token', `Bearer ${newTokens.accessToken}`);

            const newRequest = {
                ...request,
                _isRetry: true,
                credentials: 'include',
            };
            const repeatRequest = await load(newRequest);

            return repeatRequest;
        } catch (error) {
            console.log('Unknown error occured processing auth: ', error);
        }
    }

    throw { ...request, status: 401 };
};
