import { load } from '../loader';
import { updateTokens } from './updateTokens';

export const handleAuth = async (request) => {
    if (!request._isRetry) {
        try {
            const newTokens = await load(request);

            console.log(
                'Request is not retried yet... Tokens updated... processing'
            );

            localStorage.setItem('token', `Bearer ${newTokens.accessToken}`);

            const newRequest = {
                ...request,
                _isRetry: true,
                credentials: 'include',
            };

            console.log('Repeat is going to be initiated, processing: ');

            const repeatRequest = await load(newRequest);

            console.log('Repeat initiated, processing: ');

            return repeatRequest;
        } catch (error) {
            console.log('Unknown error occured processing auth: ', error);
        }
    }

    if (request._isRetry) {
        throw new Error('Failed to get an authorization after retry');
    }

    throw new Error('Error while processing auth: ', {
        ...request,
        status: 401,
    });
};
