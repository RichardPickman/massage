export const getFormData = (obj) => {
    const result = new FormData();

    for (let [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            result.append(key, value);
        }

        if (key === 'img') {
            result.append('img', value);
        }

        if (Array.isArray(value)) {
            result.append(key, JSON.stringify(value));
        }
    }

    return result;
};
