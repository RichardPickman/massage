export const ADMIN_ROUTE = '/admin';
export const LOGIN_ROUTE = '/login';
export const REGISTRATION_ROUTE = '/registration';
export const QUIZES_ROUTE = '/quiz';
export const QUIZ_CONSTRUCTOR_ROUTE = '/quiz';

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

export const imageTypes = {
    OBJECT: 'OBJECT',
    STRING: 'STRING',
} as const;

export type ImageType = (typeof imageTypes)[keyof typeof imageTypes];

export const imageURL =
    'https://png.pngtree.com/png-vector/20190820/ourlarge/pngtree-no-avatar-vector-isolated-on-white-background-png-image_1694546.jpg';
