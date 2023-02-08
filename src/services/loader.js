import { handleResponse } from './helpers/handleResponse';
import { setHeaders } from './helpers/setHeaders';

export const baseURL = process.env.REACT_APP_API_URL;

export const makeURL = (request) => {
    const resultURL = new URL(`${baseURL}${request.url}`);

    return resultURL.toString();
};

export const load = (request) => {
    const fetchData = {
        url: makeURL(request),
        payload: {
            headers: setHeaders(request.headers),
            method: request.method,
            body: request.body,
            credentials: request.credentials,
        },
    };

    return fetch(fetchData.url, fetchData.payload)
        .then((response) => handleResponse(response, request))
        .then((data) => data);
};
