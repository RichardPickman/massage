import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type AuthFormData =
    // Signing in asks for one identifier: a nickname, or an address for the
    // accounts that predate nicknames.
    | { login: string; password: string }
    // Signing up asks for no address at all: the server derives one from the
    // nickname, and the code is the same for the whole group.
    | { user: string; password: string; code: string };

export type AuthMode = 'signIn' | 'signUp';

interface AuthProps {
    submitting: boolean;
    errorData: string | null;
    onSubmit: (data: AuthFormData) => void;
    // The mode is explicit, not read off the heading: the heading is translated
    // copy now, and a form that decides whether to ask for a code by comparing a
    // label breaks the moment the label changes language.
    mode: AuthMode;
}

export const Auth = ({ submitting, errorData, onSubmit, mode }: AuthProps) => {
    const { t } = useTranslation();
    const [user, setUser] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    const isSignIn = mode === 'signIn';

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Signing in carries no code: the account already exists, and asking for
        // one would suggest the invite is still needed after registration.
        // The identifier is sent as `login`: it may be a nickname or an address,
        // and the server decides which it is by the presence of an @.
        onSubmit(
            isSignIn
                ? { login: identifier, password }
                : { user, password, code }
        );
    };

    const heading = isSignIn ? t('auth.signInTitle') : t('auth.signUpTitle');
    const alertTitle = isSignIn
        ? t('auth.couldNotSignIn')
        : t('auth.couldNotCreate');

    // A submitted form is busy, not failed: one label reads the state, so the
    // button never says "Create account" while the request is in flight.
    let submitLabel = t('auth.createAccount');

    if (submitting) {
        submitLabel = t('auth.submitting');
    } else if (isSignIn) {
        submitLabel = t('auth.signIn');
    }

    return (
        // No card around it: the form is three fields on the page itself. A box
        // around a box, a header band and a footer band cost four borders for
        // content that fits on one screen.
        <div className="mx-auto flex w-full max-w-sm flex-col gap-8">
            <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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

                {isSignIn ? (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="auth-identifier">
                            {t('auth.loginIdentifier')}
                        </Label>
                        <Input
                            id="auth-identifier"
                            // A nickname is not an address, so the field must not
                            // enforce the address shape.
                            type="text"
                            required
                            autoFocus
                            autoComplete="username"
                            value={identifier}
                            onChange={(event) =>
                                setIdentifier(event.target.value)
                            }
                        />
                    </div>
                ) : (
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
                            value={user}
                            onChange={(event) => setUser(event.target.value)}
                        />
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <Label htmlFor="auth-password">{t('auth.password')}</Label>
                    <Input
                        id="auth-password"
                        type="password"
                        required
                        autoComplete={
                            isSignIn ? 'current-password' : 'new-password'
                        }
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
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
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                        />
                    </div>
                )}

                <Button type="submit" disabled={submitting}>
                    {submitLabel}
                </Button>
            </form>

            {/* The switch to the other screen is one line of text, not a footer
                band separated by a rule. */}
            <p className="text-sm text-muted-foreground">
                {isSignIn ? t('auth.needAccount') : t('auth.alreadyRegistered')}{' '}
                <Link
                    to={isSignIn ? '/auth/register' : '/auth/login'}
                    className="text-foreground underline underline-offset-4 hover:no-underline"
                >
                    {isSignIn ? t('auth.signUp') : t('auth.signIn')}
                </Link>
            </p>
        </div>
    );
};
