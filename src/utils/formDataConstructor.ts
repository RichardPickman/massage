export type FormDataValue =
    | string
    | Blob
    | readonly unknown[]
    | null
    | undefined;

type FormDataValues = Record<string, FormDataValue>;

const isAppendable = (value: unknown): value is string | Blob =>
    typeof value === 'string' || value instanceof Blob;

export const getFormData = (values: FormDataValues): FormData => {
    const result = new FormData();

    for (const [key, value] of Object.entries(values)) {
        if (typeof value === 'string') {
            result.append(key, value);
        }

        if (key === 'img' && isAppendable(value)) {
            result.append('img', value);
        }

        if (Array.isArray(value)) {
            result.append(key, JSON.stringify(value));
        }
    }

    return result;
};
