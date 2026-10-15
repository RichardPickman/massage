export const itemTypes = {
    CARD: 'card',
    BOX: 'box',
    GRIP: 'grip',
} as const;

export type ItemType = (typeof itemTypes)[keyof typeof itemTypes];
