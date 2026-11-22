import { useTranslation } from 'react-i18next';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface StatsErrorProps {
    message: string;
    onRetry: () => void;
}

export const StatsError = ({ message, onRetry }: StatsErrorProps) => {
    const { t } = useTranslation();

    return (
        <Card className="mx-auto w-full max-w-lg">
            <CardHeader>
                <CardTitle>{t('stats.error.title')}</CardTitle>
                <CardDescription>
                    {t('stats.error.description')}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Alert variant="destructive">
                    <div className="flex flex-col gap-1">
                        <AlertTitle>{t('stats.error.alertTitle')}</AlertTitle>
                        <AlertDescription className="text-destructive">
                            {message}
                        </AlertDescription>
                    </div>
                </Alert>
                <Button className="self-start" onClick={onRetry}>
                    {t('stats.error.retry')}
                </Button>
            </CardContent>
        </Card>
    );
};
