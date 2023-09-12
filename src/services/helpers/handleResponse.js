import { handleAuth } from './handleAuth';

export const baseURL = process.env.REACT_APP_API_URL;

export const handleResponse = async (response, requestData) => {
    if (!response.ok) {
        switch (response.status) {
            case Number(401): {
                return handleAuth(requestData);
            }
            case Number(404): {
                throw { status: 404, ...response };
            }
            case Number(400): {
                const parsedResponse = await response.json();

                throw { status: 400, ...parsedResponse };
            }
            default: {
                return response;
            }
        }
    }

    return response;
};
