import type { AttemptHistoryEntry } from '../../../services/types';
import { buildTrendPath, buildTrendPoints } from '../helpers';

const WIDTH = 96;
const HEIGHT = 28;

interface SparklineProps {
    history: AttemptHistoryEntry[];
    label: string;
}

export const Sparkline = ({ history, label }: SparklineProps) => {
    if (history.length === 0) {
        return <span className="text-xs text-muted-foreground">—</span>;
    }

    const points = buildTrendPoints(history, WIDTH, HEIGHT);
    const lastPoint = points[points.length - 1];

    return (
        <svg
            width={WIDTH}
            height={HEIGHT}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={label}
            className="overflow-visible text-primary"
        >
            {points.length > 1 ? (
                <path
                    d={buildTrendPath(points)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            ) : null}
            <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r={2.5}
                fill="currentColor"
            />
        </svg>
    );
};
