export const baseURL = import.meta.env.VITE_APP_API_URL as string;

export const makeURL = (url: string) => {
    const normalizedBase = baseURL.replace(/\/+$/, '');
    const normalizedPath = url.replace(/^\/+/, '');

    return `${normalizedBase}/api/${normalizedPath}`;
};
