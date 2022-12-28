export const baseURL = process.env.REACT_APP_API_URL;

export const makeURL = (request) => {
    const resultURL = new URL(`${baseURL}${request.url}`);

    return resultURL.toString();
};

const handleResponse = (response) => {
    if (!response.ok) {
        switch (response.status) {
            case Number(41): {
                throw { status: 41, message: response.message };
            }
            case Number(417): {
                throw { status: 417, message: response.message };
            }
            case Number(403): {
                throw { status: 403, message: response.message };
            }
            case Number(404): {
                throw { status: 404, message: response.message };
            }
            default: {
                throw { status: 500, message: response.message };
            }
        }
    }
    return response;
};

export const load = (request) => {
    const fetchUrl = makeURL(request);

    return fetch(fetchUrl, {
        headers: request.headers,
        method: request.method,
        body: request.body,
    })
        .then((response) => handleResponse(response))
        .then((res) => res.json())
        .then((data) => data);
};
