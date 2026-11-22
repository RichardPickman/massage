import { useTranslation } from 'react-i18next';
import { Link, useRouteError } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
};

export const ErrorPage = () => {
    const { t } = useTranslation();
    const error = useRouteError();

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-4 py-16">
            <Link to="/" className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center bg-primary text-[0.625rem] font-semibold tracking-[0.2em] text-primary-foreground">
                    RP
                </span>
                <span className="font-heading text-sm font-semibold tracking-[0.2em] uppercase">
                    Massage
                </span>
            </Link>
            <Card className="w-full max-w-lg">
                <CardHeader className="border-b">
                    <CardTitle>{t('error.title')}</CardTitle>
                    <CardDescription>{t('error.description')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <p className="text-sm leading-relaxed break-words text-muted-foreground">
                        {getErrorMessage(error)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild>
                            <Link to="/">{t('error.back')}</Link>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            {t('error.reload')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
