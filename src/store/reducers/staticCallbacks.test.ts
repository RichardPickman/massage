import { describe, expect, it } from 'vitest';
import { fetchStatuses } from '../../utils/consts';
import { statusCallbacks, type StatusState } from './staticCallbacks';

describe('statusCallbacks', () => {
    const state = (): StatusState => ({ status: fetchStatuses.IDLE });

    it('marks a request as in flight', () => {
        const target = state();

        statusCallbacks.PENDING(target);

        expect(target.status).toBe(fetchStatuses.PENDING);
    });

    it('marks a request as failed', () => {
        const target = state();

        statusCallbacks.REJECTED(target);

        expect(target.status).toBe(fetchStatuses.FAILED);
    });

    it('returns to idle', () => {
        const target: StatusState = { status: fetchStatuses.FAILED };

        statusCallbacks.IDLE(target);

        expect(target.status).toBe(fetchStatuses.IDLE);
    });
});
