import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '../../components/PageHeader';
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
    const { t } = useTranslation();
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
            <PageHeader
                kicker={t('stats.kicker')}
                title={t('stats.title')}
                meta={
                    latestAttempt ? (
                        <p className="text-sm text-muted-foreground">
                            {t('stats.lastAttempt', {
                                date: formatDate(latestAttempt),
                            })}
                        </p>
                    ) : undefined
                }
            />
            {error ? (
                <Alert variant="destructive">
                    <div className="flex flex-1 flex-col gap-2">
                        <AlertTitle>{t('stats.staleTitle')}</AlertTitle>
                        <AlertDescription className="text-destructive">
                            {error}
                        </AlertDescription>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleRetry}>
                        {t('stats.refresh')}
                    </Button>
                </Alert>
            ) : null}
            <SummaryStats stats={data} />
            <QuizStatsTable quizzes={data.quizzes} />
        </div>
    );
};
