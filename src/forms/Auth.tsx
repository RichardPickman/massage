import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

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

export type AuthFormData = {
    email: string;
    password: string;
    code?: string;
    // The name the app shows; the address is what the code was issued for and
    // what signing in uses.
    user?: string;
};

export type AuthMode = 'signIn' | 'signUp';

interface AuthProps {
    submitting: boolean;
    errorData: string | null;
    onSubmit: (data: AuthFormData) => void;
    // The mode is explicit, not read off the heading: the heading is translated
    // copy now, and a card that decides whether to ask for a code by comparing a
    // label breaks the moment the label changes language.
    mode: AuthMode;
}

export const Auth = ({ submitting, errorData, onSubmit, mode }: AuthProps) => {
    const { t } = useTranslation();
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    const isSignIn = mode === 'signIn';

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Signing in carries no code: the account already exists, and asking for
        // one would suggest the invite is still needed after registration.
        onSubmit(
            isSignIn ? { email, password } : { user, email, password, code }
        );
    };

    const heading = isSignIn ? t('auth.signInTitle') : t('auth.signUpTitle');

    const description = isSignIn
        ? t('auth.welcomeBack')
        : t('auth.createWithInvite');

    const alertTitle = isSignIn
        ? t('auth.couldNotSignIn')
        : t('auth.couldNotCreate');

    const submitLabel = () => {
        if (submitting) {
            return t('auth.submitting');
        }

        if (isSignIn) {
            return t('auth.signIn');
        }

        return t('auth.createAccount');
    };

    return (
        <Card className="mx-auto w-full max-w-md">
            <CardHeader className="border-b">
                <CardTitle>{heading}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {errorData ? (
                        <Alert variant="destructive">
                            <div className="flex flex-col gap-1">
                                <AlertTitle>{alertTitle}</AlertTitle>
                                <AlertDescription className="text-destructive">
                                    {errorData}
                                </AlertDescription>
                            </div>
                        </Alert>
                    ) : null}
                    {isSignIn ? null : (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="auth-nickname">
                                {t('auth.nickname')}
                            </Label>
                            <Input
                                id="auth-nickname"
                                required
                                minLength={3}
                                maxLength={24}
                                autoFocus
                                autoComplete="nickname"
                                placeholder={t('auth.nicknamePlaceholder')}
                                value={user}
                                onChange={(event) =>
                                    setUser(event.target.value)
                                }
                                aria-describedby="auth-nickname-hint"
                            />
                            <p
                                id="auth-nickname-hint"
                                className="text-xs text-muted-foreground"
                            >
                                {t('auth.nicknameHint')}
                            </p>
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="auth-email">{t('auth.email')}</Label>
                        <Input
                            id="auth-email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="auth-password">
                            {t('auth.password')}
                        </Label>
                        <Input
                            id="auth-password"
                            type="password"
                            required
                            autoComplete={
                                isSignIn ? 'current-password' : 'new-password'
                            }
                            placeholder="••••••••"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                    </div>
                    {isSignIn ? null : (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="auth-code">
                                {t('auth.inviteCode')}
                            </Label>
                            <Input
                                id="auth-code"
                                required
                                autoComplete="off"
                                spellCheck={false}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                value={code}
                                onChange={(event) =>
                                    setCode(event.target.value)
                                }
                            />
                            <p className="text-sm text-muted-foreground">
                                {t('auth.inviteHint')}
                            </p>
                        </div>
                    )}
                    <Button type="submit" disabled={submitting}>
                        {submitLabel()}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="border-t text-sm text-muted-foreground">
                {isSignIn ? (
                    <p>
                        {t('auth.needAccount')}{' '}
                        <Link
                            to="/auth/register"
                            className="underline underline-offset-4 hover:text-foreground"
                        >
                            {t('auth.signUp')}
                        </Link>
                    </p>
                ) : (
                    <p>
                        {t('auth.alreadyRegistered')}{' '}
                        <Link
                            to="/auth/login"
                            className="underline underline-offset-4 hover:text-foreground"
                        >
                            {t('auth.signIn')}
                        </Link>
                    </p>
                )}
            </CardFooter>
        </Card>
    );
};
