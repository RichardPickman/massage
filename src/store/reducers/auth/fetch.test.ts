import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getToken, setToken } from '../../../services/helpers/token';
import UserService from '../../../services/User';
import { fetchLogout } from './fetch';

// Signing out is the one place where a failed request must still end the session:
// the token goes in `finally`, so a server that answers 404 (the route does not
// exist) cannot leave a user signed in on their own device.
describe('fetchLogout', () => {
    beforeEach(() => {
        localStorage.clear();
        setToken('abc');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('drops the token when the server confirms', async () => {
        vi.spyOn(UserService, 'logout').mockResolvedValue(undefined as never);

        await fetchLogout()(vi.fn(), () => ({}), undefined);

        expect(getToken()).toBeNull();
    });

    it('drops the token when the server refuses', async () => {
        vi.spyOn(UserService, 'logout').mockRejectedValue(
            Object.assign(new Error('Not found'), { status: 404 })
        );

        const result = await fetchLogout()(vi.fn(), () => ({}), undefined);

        expect(getToken()).toBeNull();
        expect(fetchLogout.rejected.match(result)).toBe(true);
    });
});
