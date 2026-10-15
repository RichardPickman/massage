export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestPayload {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: BodyInit;
    credentials?: RequestCredentials;
}

export interface ApiResponse<T> {
    message: string;
    payload: T;
}
