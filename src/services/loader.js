export const baseURL = process.env.REACT_APP_API_URL;

export const makeURL = (request) => {
    const resultURL = new URL(`${baseURL}/${request.url}`);
    if (request.searchParams) {
        const entries = Object.entries(request.searchParams);
        entries.forEach((entry) => {
            const [key, value] = entry;
            resultURL.searchParams.append(key, value);
        });
    }
    return resultURL.toString();
};

const handleResponse = (response) => {
    if (!response.ok) {
        switch (response.status) {
            case Number(41): {
                throw new Error(41);
            }
            case Number(417): {
                throw new Error(417);
            }
            case Number(403): {
                throw new Error(403);
            }
            case Number(404): {
                throw new Error(404);
            }
            default: {
                throw new Error(
                    `Ooops! ${response.status} ${response.statusText}`
                );
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
        .then((data) => data)
        .catch((error) => {
            console.log(error.message);
        });
};
