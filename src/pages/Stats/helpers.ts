import dayjs from 'dayjs';

import type { AttemptHistoryEntry } from '../../services/types';

export interface TrendPoint {
    value: number;
    x: number;
    y: number;
}

export type ScoreTone = 'strong' | 'steady' | 'weak';

export const removedQuizTitle = 'Deleted quiz';

const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);

export const formatPercent = (value: number) => `${Math.round(value)}%`;

export const formatDate = (value: string) => dayjs(value).format('D MMM YYYY');

export const getScoreTone = (value: number): ScoreTone => {
    if (value >= 80) {
        return 'strong';
    }

    if (value >= 50) {
        return 'steady';
    }

    return 'weak';
};

export const scoreToneClasses: Record<ScoreTone, string> = {
    strong: 'text-primary',
    steady: 'text-foreground',
    weak: 'text-destructive',
};

// The API hands history back newest-first; a chart reads left to right.
export const buildTrendPoints = (
    history: AttemptHistoryEntry[],
    width: number,
    height: number
): TrendPoint[] => {
    const percents = history.map((entry) => entry.percent).reverse();
    const padding = 3;
    const innerHeight = height - padding * 2;
    const step = percents.length > 1 ? width / (percents.length - 1) : 0;

    return percents.map((percent, index) => ({
        value: percent,
        x: percents.length > 1 ? index * step : width / 2,
        y: padding + (1 - clampPercent(percent) / 100) * innerHeight,
    }));
};

export const buildTrendPath = (points: TrendPoint[]) =>
    points
        .map(
            (point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`
        )
        .join(' ');
