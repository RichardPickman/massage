import { afterEach, describe, expect, it, vi } from 'vitest';

// `baseURL` is read from import.meta.env when the module is first evaluated, so a
// stub installed inside a test arrives too late: the URL builder is mocked instead,
// which is also the only part of `load` this suite does not care about.
vi.mock('./helpers/makeUrl', () => ({
    baseURL: 'http://localhost:8280',
    makeURL: (path: string) =>
        `http://localhost:8280/api/${path.replace(/^\/+/, '')}`,
}));

import { load } from './loader';

const capture = () => {
    const calls: { url: string; init: RequestInit }[] = [];

    vi.stubGlobal(
        'fetch',
        vi.fn((url: string, init: RequestInit) => {
            calls.push({ url, init });

            return Promise.resolve(
                new Response('{}', {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                })
            );
        })
    );

    return calls;
};

describe('load', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        localStorage.clear();
    });

    it('types a string body as JSON when the caller forgot to', async () => {
        const calls = capture();

        await load({
            url: 'admin/users/u1',
            method: 'PATCH',
            body: '{"role":"admin"}',
        });

        // Without this header Express' json() parser drops the body, the request
        // answers 200 and writes nothing: the panel looks broken, the server is not.
        expect(
            (calls[0].init.headers as Record<string, string>)['Content-Type']
        ).toBe('application/json');
    });

    it('leaves a type the caller did declare alone', async () => {
        const calls = capture();

        await load({
            url: 'lectures/pdf',
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: 'plain',
        });

        expect(
            (calls[0].init.headers as Record<string, string>)['Content-Type']
        ).toBe('text/plain');
    });

    it('never types a FormData body, so the browser keeps its boundary', async () => {
        const calls = capture();
        const form = new FormData();

        form.append('file', new Blob(['x']), 'x.png');

        await load({ url: 'lectures/image', method: 'POST', body: form });

        const headers = calls[0].init.headers as Record<string, string>;

        expect(headers['Content-Type']).toBeUndefined();
        expect(calls[0].init.body).toBe(form);
    });

    it('still carries the stored token', async () => {
        localStorage.setItem('token', 'Bearer abc');
        const calls = capture();

        await load({ url: 'admin/users', method: 'GET' });

        expect(
            (calls[0].init.headers as Record<string, string>).Authorization
        ).toBe('Bearer abc');
    });
});
