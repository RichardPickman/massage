import { beforeEach, describe, expect, it } from 'vitest';
import { getToken, removeToken, setToken } from './token';

// The stored value is a ready header, not a bare token: every request reads it
// straight into `Authorization`, and a missing "Bearer" prefix answers 401 on a
// token that is perfectly valid.
describe('token storage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('stores the token with the Bearer prefix', () => {
        setToken('abc');

        expect(localStorage.getItem('token')).toBe('Bearer abc');
    });

    it('reads back what it stored', () => {
        setToken('abc');

        expect(getToken()).toBe('Bearer abc');
    });

    it('answers null when nobody signed in', () => {
        expect(getToken()).toBeNull();
    });

    it('removes the token on sign out', () => {
        setToken('abc');
        removeToken();

        expect(getToken()).toBeNull();
    });
});
