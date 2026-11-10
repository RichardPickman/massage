import { useEffect } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchOverallStats } from '../../store/reducers/stats/fetch';
import { QuizStatsTable } from './components/QuizStatsTable';
import { SignedOutHero } from './components/SignedOutHero';
import { StatsEmpty } from './components/StatsEmpty';
import { StatsError } from './components/StatsError';
import { StatsSkeleton } from './components/StatsSkeleton';
import { SummaryStats } from './components/SummaryStats';
import { formatDate } from './helpers';

export const StatsPage = () => {
    const { isAuth, isRestoringSession } = useAppSelector(
        (state) => state.auth
    );
    const { data, error } = useAppSelector((state) => state.stats);
    const dispatch = useAppDispatch();

    // Mount and every sign-in are the moments the record can have changed;
    // the cached copy is shown while the fresh one is on its way.
    useEffect(() => {
        if (!isAuth) {
            return;
        }

        dispatch(fetchOverallStats());
    }, [dispatch, isAuth]);

    const handleRetry = () => {
        dispatch(fetchOverallStats());
    };

    if (isRestoringSession) {
        return <StatsSkeleton />;
    }

    if (!isAuth) {
        return <SignedOutHero />;
    }

    if (!data) {
        if (error) {
            return <StatsError message={error} onRetry={handleRetry} />;
        }

        return <StatsSkeleton />;
    }

    if (data.count === 0) {
        return <StatsEmpty />;
    }

    const latestAttempt = data.quizzes[0]?.history[0]?.createdAt;

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-2 border-b pb-6">
                <p className="text-[0.625rem] tracking-[0.3em] text-muted-foreground uppercase">
                    Overview
                </p>
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                        Your test record
                    </h1>
                    {latestAttempt ? (
                        <p className="text-sm text-muted-foreground">
                            Last attempt {formatDate(latestAttempt)}
                        </p>
                    ) : null}
                </div>
            </header>
            {error ? (
                <Alert variant="destructive">
                    <div className="flex flex-1 flex-col gap-2">
                        <AlertTitle>This record may be out of date</AlertTitle>
                        <AlertDescription className="text-destructive">
                            {error}
                        </AlertDescription>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleRetry}>
                        Refresh
                    </Button>
                </Alert>
            ) : null}
            <SummaryStats stats={data} />
            <QuizStatsTable quizzes={data.quizzes} />
        </div>
    );
};
