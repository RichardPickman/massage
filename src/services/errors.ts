export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        return error.message;
    }

    return 'Unknown error occured while processing the request';
};
