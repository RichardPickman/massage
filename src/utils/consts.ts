export const fetchStatuses = {
    IDLE: 'idle',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
    PENDING: 'pending',
} as const;

export type FetchStatus = (typeof fetchStatuses)[keyof typeof fetchStatuses];

export const alertStatuses = {
    SUCCESS: 'success',
    FAIL: 'failed',
} as const;

export type AlertStatus = (typeof alertStatuses)[keyof typeof alertStatuses];
