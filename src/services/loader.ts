import { ApiError } from './errors';
import { makeURL } from './helpers/makeUrl';
import { notifySessionExpired } from './helpers/session';
import { setHeaders } from './helpers/setHeaders';
import { removeToken } from './helpers/token';
import type { RequestPayload } from './types';

interface ErrorBody {
    message?: string;
    code?: string;
}

const readError = async (response: Response) => {
    const fallback = `Request failed with status ${response.status}`;

    try {
        const body = (await response.json()) as ErrorBody;

        // Older endpoints send the HTTP status in `code`; only a string is one of
        // the contract's reason codes.
        return {
            message: body.message || fallback,
            code: typeof body.code === 'string' ? body.code : undefined,
        };
    } catch {
        return { message: fallback, code: undefined };
    }
};

export const load = async <T>(request: RequestPayload) => {
    const url = makeURL(request.url);
    const headers = setHeaders(request.headers);
    const carriedToken = Boolean(headers.Authorization);

    // A string body is JSON unless the caller said otherwise. Forgetting the
    // header is silent: Express' json() parser then ignores the body, the request
    // answers 200 and changes nothing — which is how "promote to admin" looked
    // broken while the server was fine. FormData must keep its own boundary, so
    // only a string body is touched.
    const declaresType = Object.keys(headers).some(
        (name) => name.toLowerCase() === 'content-type'
    );

    if (typeof request.body === 'string' && !declaresType) {
        headers['Content-Type'] = 'application/json';
    }

    const init: RequestInit = {
        method: request.method,
        headers,
        body: request.body,
        credentials: request.credentials,
    };

    const response = await fetch(url, init);

    if (!response.ok) {
        const { message, code } = await readError(response);

        // Only a rejected authenticated request means the session is dead;
        // a 401 on a request without a token is just a failed sign-in.
        if (response.status === 401 && carriedToken) {
            removeToken();
            notifySessionExpired();
        }

        throw new ApiError(response.status, message, code);
    }

    return (await response.json()) as T;
};
