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

describe('formatLectureDate', () => {
    it('shows the stored day in the language of the interface', async () => {
        const { default: i18n, setLanguage } = await import('../../i18n');
        const { formatLectureDate } = await import('./helpers');

        // The API stores MM/DD/YYYY and the form keeps submitting it that way;
        // only the display follows the language.
        await setLanguage('en');
        expect(formatLectureDate('10/19/2026')).toBe('10/19/2026');

        await setLanguage('pl');
        expect(formatLectureDate('10/19/2026')).toBe('19.10.2026');
        expect(i18n.language).toBe('pl');

        await setLanguage('en');
    });
});
