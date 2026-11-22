import { cn } from 'cn';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export const SignedOutHero = () => {
    const { t } = useTranslation();

    const steps = [
        {
            index: '01',
            title: t('stats.hero.steps.read.title'),
            text: t('stats.hero.steps.read.text'),
        },
        {
            index: '02',
            title: t('stats.hero.steps.test.title'),
            text: t('stats.hero.steps.test.text'),
        },
        {
            index: '03',
            title: t('stats.hero.steps.trend.title'),
            text: t('stats.hero.steps.trend.text'),
        },
    ];

    return (
        <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="flex flex-col gap-6">
                <span className="flex items-center gap-3 text-[0.625rem] tracking-[0.3em] text-muted-foreground uppercase">
                    <span className="h-px w-8 bg-primary" aria-hidden="true" />
                    RP
                </span>
                <h1 className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    {t('stats.hero.titleLead')}
                    <br />
                    <span className="text-primary">
                        {t('stats.hero.titleAccent')}
                    </span>
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                    {t('stats.hero.lead')}
                </p>
                <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg">
                        <Link to="/auth/login">{t('stats.hero.signIn')}</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link to="/quiz">{t('stats.hero.takeTest')}</Link>
                    </Button>
                    <Button asChild size="lg" variant="ghost">
                        <Link to="/lectures">
                            {t('stats.hero.browseLectures')}
                        </Link>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    {t('stats.hero.noAccount')}{' '}
                    <Link
                        to="/auth/register"
                        className="underline underline-offset-4 hover:text-foreground"
                    >
                        {t('stats.hero.createOne')}
                    </Link>{' '}
                    {t('stats.hero.takesMinute')}
                </p>
            </div>
            <Card>
                <CardHeader className="border-b">
                    <CardTitle>{t('stats.hero.cardTitle')}</CardTitle>
                    <CardDescription>
                        {t('stats.hero.cardDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                    {steps.map((step, index) => (
                        <div
                            key={step.index}
                            className={cn(
                                'flex gap-4 py-5',
                                index > 0 && 'border-t'
                            )}
                        >
                            <span className="font-heading text-xs font-semibold tracking-[0.2em] text-primary">
                                {step.index}
                            </span>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium">
                                    {step.title}
                                </span>
                                <span className="text-sm leading-relaxed text-muted-foreground">
                                    {step.text}
                                </span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </section>
    );
};
