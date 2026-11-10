import { describe, expect, it } from 'vitest';

import {
    buildTrendPath,
    buildTrendPoints,
    formatPercent,
    getScoreTone,
} from './helpers';

describe('getScoreTone', () => {
    it('marks 80 and above as strong', () => {
        expect(getScoreTone(80)).toBe('strong');
        expect(getScoreTone(100)).toBe('strong');
    });

    it('marks 50 to 79 as steady', () => {
        expect(getScoreTone(50)).toBe('steady');
        expect(getScoreTone(79)).toBe('steady');
    });

    it('marks anything below 50 as weak', () => {
        expect(getScoreTone(49)).toBe('weak');
        expect(getScoreTone(0)).toBe('weak');
    });
});

describe('formatPercent', () => {
    it('rounds to a whole percent', () => {
        expect(formatPercent(72.4)).toBe('72%');
        expect(formatPercent(72.6)).toBe('73%');
    });
});

describe('buildTrendPoints', () => {
    it('returns nothing for an empty history', () => {
        expect(buildTrendPoints([], 100, 20)).toEqual([]);
    });

    it('draws the newest-first history oldest to newest', () => {
        const points = buildTrendPoints(
            [
                { percent: 80, createdAt: '2026-10-10' },
                { percent: 40, createdAt: '2026-10-09' },
            ],
            100,
            20
        );

        expect(points.map((point) => point.value)).toEqual([40, 80]);
        expect(points[0].x).toBe(0);
        expect(points[1].x).toBe(100);
    });

    it('centres a single attempt', () => {
        const points = buildTrendPoints(
            [{ percent: 100, createdAt: '2026-10-10' }],
            100,
            20
        );

        expect(points).toHaveLength(1);
        expect(points[0].x).toBe(50);
        expect(points[0].y).toBe(3);
    });

    it('clamps scores outside 0 to 100 into the chart', () => {
        const points = buildTrendPoints(
            [
                { percent: 140, createdAt: '2026-10-10' },
                { percent: -20, createdAt: '2026-10-09' },
            ],
            100,
            20
        );

        expect(points[0].y).toBe(17);
        expect(points[1].y).toBe(3);
    });
});

describe('buildTrendPath', () => {
    it('moves to the first point and lines to the rest', () => {
        expect(
            buildTrendPath([
                { value: 40, x: 0, y: 10 },
                { value: 80, x: 10, y: 0 },
            ])
        ).toBe('M0 10 L10 0');
    });
});
