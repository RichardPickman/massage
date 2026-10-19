import { fetchStatuses, type FetchStatus } from '../../utils/consts';

export interface StatusState {
    status: FetchStatus;
}

export interface StatusCallbacks {
    PENDING: (state: StatusState) => void;
    IDLE: (state: StatusState) => void;
    REJECTED: (state: StatusState) => void;
}

export const statusCallbacks: StatusCallbacks = {
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
