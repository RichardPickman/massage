import { ApiError } from './errors';
import { makeURL } from './helpers/makeUrl';
import { notifySessionExpired } from './helpers/session';
import { setHeaders } from './helpers/setHeaders';
import { removeToken } from './helpers/token';
import type { RequestPayload } from './types';

const readErrorMessage = async (response: Response) => {
    const fallback = `Request failed with status ${response.status}`;

    try {
        const body = (await response.json()) as { message?: string };

        return body.message || fallback;
    } catch {
        return fallback;
    }
};

export const load = async <T>(request: RequestPayload) => {
    const url = makeURL(request.url);
    const headers = setHeaders(request.headers);
    const carriedToken = Boolean(headers.Authorization);

    const init: RequestInit = {
        method: request.method,
        headers,
        body: request.body,
        credentials: request.credentials,
    };

    const response = await fetch(url, init);

    if (!response.ok) {
        const message = await readErrorMessage(response);

        // Only a rejected authenticated request means the session is dead;
        // a 401 on a request without a token is just a failed sign-in.
        if (response.status === 401 && carriedToken) {
            removeToken();
            notifySessionExpired();
        }

        throw new ApiError(response.status, message);
    }

    return (await response.json()) as T;
};
