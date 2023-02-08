import { fetchStatuses } from '../../utils/consts';

export const statusCallbacks = {
    PENDING: (state) => {
        state.status = fetchStatuses.PENDING;
    },
    IDLE: (state) => {
        state.status = fetchStatuses.IDLE;
    },
    REJECTED: (state) => {
        state.status = fetchStatuses.FAILED;
    },
};
