import { useState, type FormEvent } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminService from '../../services/Admin';
import { getErrorMessage } from '../../services/errors';
import type { Invite } from '../../services/types';

export const Admin = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [invite, setInvite] = useState<Invite | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isMinting, setIsMinting] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsMinting(true);
        setError(null);
        setCopied(false);

        try {
            setInvite(await AdminService.invite(email));
        } catch (failure) {
            setInvite(null);
            setError(getErrorMessage(failure));
        } finally {
            setIsMinting(false);
        }
    };

    const handleCopy = () => {
        // Clipboard access needs a secure context, and a browser that refuses it
        // is no reason to lose the code: it stays on screen and selectable.
        if (!navigator.clipboard || !invite) {
            return;
        }

        navigator.clipboard
            .writeText(invite.code)
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
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="invite-email">{t('admin.email')}</Label>
                        <Input
                            id="invite-email"
                            type="email"
                            required
                            placeholder="friend@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={isMinting}>
                        {isMinting ? t('admin.minting') : t('admin.submit')}
                    </Button>
                </form>
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
                {invite ? (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium">
                            {t('admin.codeFor', { email: invite.email })}
                        </p>
                        <code className="rounded-md border bg-muted px-3 py-2 font-mono text-lg tracking-wider">
                            {invite.code}
                        </code>
                    </div>
                ) : null}
            </CardContent>
            {invite ? (
                <CardFooter className="border-t">
                    <Button variant="secondary" onClick={handleCopy}>
                        {copied ? t('admin.copied') : t('admin.copy')}
                    </Button>
                </CardFooter>
            ) : null}
        </Card>
    );
};
