import { describe, expect, it, vi } from 'vitest';
import { notifySessionExpired, onSessionExpired } from './session';

// The request layer sits outside React, so an expired session is announced here and
// the store clears itself. Two things break quietly if this regresses: a listener
// that is never removed keeps a dead store alive, and one that is not called leaves
// the user staring at a page that answers 401 forever.
describe('session expiry', () => {
    it('calls every listener', () => {
        const first = vi.fn();
        const second = vi.fn();
        const offFirst = onSessionExpired(first);
        const offSecond = onSessionExpired(second);

        notifySessionExpired();

        expect(first).toHaveBeenCalledTimes(1);
        expect(second).toHaveBeenCalledTimes(1);

        offFirst();
        offSecond();
    });

    it('stops calling a listener that unsubscribed', () => {
        const listener = vi.fn();
        const unsubscribe = onSessionExpired(listener);

        unsubscribe();
        notifySessionExpired();

        expect(listener).not.toHaveBeenCalled();
    });

    it('does nothing when nobody listens', () => {
        expect(() => notifySessionExpired()).not.toThrow();
    });
});
