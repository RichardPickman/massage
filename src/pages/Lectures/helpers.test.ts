import { describe, expect, it } from 'vitest';
import { getTableRows } from './helpers';

describe('getTableRows', () => {
    it('keeps the author so the list can gate owner actions', () => {
        const rows = getTableRows([
            {
                _id: 'lecture-1',
                topic: 'Anatomy',
                images: [],
                teacher: ['Czerwińska'],
                lesson: ['Ortodoncja'],
                date: '10/19/2026',
                author: 'user-1',
            },
        ]);

        expect(rows).toEqual([
            {
                id: 'lecture-1',
                topic: 'Anatomy',
                teacher: 'Czerwińska',
                lesson: 'Ortodoncja',
                date: '10/19/2026',
                author: 'user-1',
            },
        ]);
    });
});
