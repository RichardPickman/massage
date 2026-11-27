import { describe, expect, it } from 'vitest';
import { getUserFromToken } from './getUserFromToken';

// A JWT is decoded, never trusted, and every screen that shows a name or a role
// reads this. The fallbacks matter: a token minted before nicknames existed has no
// `nickname`, and a hand-edited token in localStorage must answer null instead of
// throwing on render.
const encode = (payload: unknown) => {
    const body = btoa(JSON.stringify(payload)).replace(/=+$/, '');

    return `header.${body}.signature`;
};

describe('getUserFromToken', () => {
    it('reads id, email and role', () => {
        const token = encode({
            id: '1',
            email: 'a@students.local',
            role: 'admin',
        });

        expect(getUserFromToken(token)).toEqual({
            id: '1',
            email: 'a@students.local',
            role: 'admin',
            nickname: null,
        });
    });

    it('keeps the nickname when the token carries one', () => {
        const token = encode({
            id: '1',
            email: 'a@students.local',
            role: 'user',
            nickname: 'Ania',
        });

        expect(getUserFromToken(token)?.nickname).toBe('Ania');
    });

    it('answers null for a token without a role', () => {
        expect(getUserFromToken(encode({ id: '1', email: 'a@b' }))).toBeNull();
    });

    it('answers null for a token without an id', () => {
        expect(
            getUserFromToken(encode({ email: 'a@b', role: 'user' }))
        ).toBeNull();
    });

    it('answers null for something that is not a token', () => {
        expect(getUserFromToken('not-a-token')).toBeNull();
    });
});
