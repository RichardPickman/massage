import { describeServerMessage } from '../i18n/serverMessages';

export class ApiError extends Error {
    readonly status: number;
    // The server's machine-readable reason, when it sent one. The message is the
    // English fallback; the code is what gets translated.
    readonly code?: string;

    constructor(status: number, message: string, code?: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}

export const getErrorMessage = (error: unknown) => {
    if (error instanceof ApiError) {
        return describeServerMessage(error.code, error.message);
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Unknown error occured while processing the request';
};
