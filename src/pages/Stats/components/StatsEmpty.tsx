import { ChartLineUpIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const StatsEmpty = () => (
    <Card>
        <CardContent className="flex flex-col items-center gap-5 py-6 text-center">
            <span className="flex size-12 items-center justify-center bg-muted text-muted-foreground">
                <ChartLineUpIcon className="size-5" />
            </span>
            <div className="flex flex-col gap-1">
                <p className="font-heading text-xl font-semibold tracking-tight">
                    No attempts on record
                </p>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    Take a test and your score, best result and trend will show
                    up here.
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                <Button asChild>
                    <Link to="/quiz">Browse tests</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link to="/lectures">Read lectures</Link>
                </Button>
            </div>
        </CardContent>
    </Card>
);
