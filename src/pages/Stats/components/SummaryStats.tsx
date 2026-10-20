import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { OverallStats } from '../../../services/types';
import { formatPercent, getScoreTone, scoreToneClasses } from '../helpers';

interface SummaryStatsProps {
    stats: OverallStats;
}

export const SummaryStats = ({ stats }: SummaryStatsProps) => {
    const items = [
        { label: 'Best', value: formatPercent(stats.best) },
        { label: 'Last', value: formatPercent(stats.last) },
        { label: 'Attempts', value: String(stats.count) },
        { label: 'Tests', value: String(stats.quizzes.length) },
    ];

    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>Average score</CardTitle>
                <CardDescription>
                    Across every attempt on your record.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
                <div className="flex items-end gap-2">
                    <span
                        className={`font-heading text-7xl leading-none font-semibold tracking-tighter tabular-nums ${
                            scoreToneClasses[getScoreTone(stats.average)]
                        }`}
                    >
                        {Math.round(stats.average)}
                    </span>
                    <span className="pb-2 text-xl text-muted-foreground">
                        %
                    </span>
                </div>
                <div className="flex flex-col gap-6">
                    <Progress value={stats.average} className="h-1.5" />
                    <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-border">
                        {items.map((item) => (
                            <div
                                key={item.label}
                                className="flex flex-col gap-1 sm:px-5 sm:first:pl-0 sm:last:pr-0"
                            >
                                <span className="text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase">
                                    {item.label}
                                </span>
                                <span className="font-heading text-xl font-semibold tabular-nums">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
