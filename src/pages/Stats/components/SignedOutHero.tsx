import { cn } from 'cn';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const steps = [
    {
        index: '01',
        title: 'Read the lecture',
        text: 'Work through the image slides at your own pace.',
    },
    {
        index: '02',
        title: 'Take the test',
        text: 'Every answer is scored by the server, not the browser.',
    },
    {
        index: '03',
        title: 'Watch the line',
        text: 'Best, average and every attempt stay on your record.',
    },
];

export const SignedOutHero = () => (
    <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="flex flex-col gap-6">
            <span className="flex items-center gap-3 text-[0.625rem] tracking-[0.3em] text-muted-foreground uppercase">
                <span className="h-px w-8 bg-primary" aria-hidden="true" />
                RP
            </span>
            <h1 className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Learn the body.
                <br />
                <span className="text-primary">Prove you know it.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                Lecture notes, image slides and scored tests in one place. Sign
                in to keep a running record of every attempt, your best score
                and where you are slipping.
            </p>
            <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                    <Link to="/auth/login">Sign in</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link to="/quiz">Take a test</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                    <Link to="/lectures">Browse lectures</Link>
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                No account?{' '}
                <Link
                    to="/auth/register"
                    className="underline underline-offset-4 hover:text-foreground"
                >
                    Create one
                </Link>{' '}
                — it takes a minute.
            </p>
        </div>
        <Card>
            <CardHeader className="border-b">
                <CardTitle>How the record works</CardTitle>
                <CardDescription>
                    Three steps, repeated. The numbers do the rest.
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
