import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AdminService from '../../services/Admin';
import { getErrorMessage } from '../../services/errors';

export const Admin = () => {
    const { t } = useTranslation();
    const [code, setCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // There is nothing to fill in any more: the code is one value for the whole
    // group, so the panel loads it instead of asking who it is for.
    const load = async () => {
        setIsLoading(true);
        setError(null);
        setCopied(false);

        try {
            setCode((await AdminService.registrationCode()).code);
        } catch (failure) {
            setCode(null);
            setError(getErrorMessage(failure));
        } finally {
            setIsLoading(false);
        }
    };

    // Once, on mount: the panel has exactly one thing to show.
    useEffect(() => {
        load();
    }, []);

    const handleCopy = () => {
        // Clipboard access needs a secure context, and a browser that refuses it
        // is no reason to lose the code: it stays on screen and selectable.
        if (!navigator.clipboard || !code) {
            return;
        }

        navigator.clipboard
            .writeText(code)
            .then(() => setCopied(true))
            .catch(() => setCopied(false));
    };

    return (
        <Card className="mx-auto w-full max-w-xl">
            <CardHeader className="border-b">
                <CardTitle>{t('admin.title')}</CardTitle>
                <CardDescription>{t('admin.description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {error ? (
                    <Alert variant="destructive">
                        <div className="flex flex-col gap-1">
                            <AlertTitle>{t('admin.errorTitle')}</AlertTitle>
                            <AlertDescription className="text-destructive">
                                {error}
                            </AlertDescription>
                        </div>
                    </Alert>
                ) : null}
                {code ? (
                    <code className="rounded-md border bg-muted px-3 py-2 font-mono text-lg tracking-wider break-all">
                        {code}
                    </code>
                ) : isLoading ? (
                    <p className="text-sm text-muted-foreground">
                        {t('admin.loading')}
                    </p>
                ) : (
                    <Button
                        variant="secondary"
                        className="self-start"
                        onClick={load}
                    >
                        {t('admin.submit')}
                    </Button>
                )}
            </CardContent>
            {code ? (
                <CardFooter className="border-t">
                    <Button variant="secondary" onClick={handleCopy}>
                        {copied ? t('admin.copied') : t('admin.copy')}
                    </Button>
                </CardFooter>
            ) : null}
        </Card>
    );
};
