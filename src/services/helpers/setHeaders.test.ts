import { beforeEach, describe, expect, it } from 'vitest';
import { setHeaders } from './setHeaders';
import { setToken } from './token';

describe('setHeaders', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('sends no Authorization header for a guest', () => {
        expect(setHeaders()).toEqual({});
    });

    it('attaches the stored token', () => {
        setToken('abc');

        expect(setHeaders()).toEqual({ Authorization: 'Bearer abc' });
    });

    it('keeps the headers the caller passed', () => {
        setToken('abc');

        expect(setHeaders({ 'Content-Type': 'application/json' })).toEqual({
            'Content-Type': 'application/json',
            Authorization: 'Bearer abc',
        });
    });

    it('does not mutate the object it was given', () => {
        setToken('abc');
        const headers = { Accept: 'application/json' };

        setHeaders(headers);

        expect(headers).toEqual({ Accept: 'application/json' });
    });
});
