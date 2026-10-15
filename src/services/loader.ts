import { ApiError } from './errors';
import { makeURL } from './helpers/makeUrl';
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

    const init: RequestInit = {
        method: request.method,
        headers: setHeaders(request.headers),
        body: request.body,
        credentials: request.credentials,
    };

    const response = await fetch(url, init);

    if (!response.ok) {
        const message = await readErrorMessage(response);

        if (response.status === 401) {
            removeToken();
        }

        throw new ApiError(response.status, message);
    }

    return (await response.json()) as T;
};

