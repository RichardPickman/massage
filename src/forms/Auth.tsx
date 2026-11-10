import { useState, type FormEvent } from 'react';
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
};

interface AuthProps {
    submitting: boolean;
    errorData: string | null;
    onSubmit: (data: AuthFormData) => void;
    header: string;
}

export const Auth = ({
    submitting,
    errorData,
    onSubmit,
    header,
}: AuthProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    const isSignIn = header === 'Sign In';

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Signing in carries no code: the account already exists, and asking for
        // one would suggest the invite is still needed after registration.
        onSubmit(isSignIn ? { email, password } : { email, password, code });
    };

    return (
        <Card className="mx-auto w-full max-w-md">
            <CardHeader className="border-b">
                <CardTitle>{header}</CardTitle>
                <CardDescription>
                    {isSignIn
                        ? 'Welcome back. Your test record is waiting.'
                        : 'Create an account with the invite code you were sent.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {errorData ? (
                        <Alert variant="destructive">
                            <div className="flex flex-col gap-1">
                                <AlertTitle>
                                    {isSignIn
                                        ? 'Could not sign in'
                                        : 'Could not create the account'}
                                </AlertTitle>
                                <AlertDescription className="text-destructive">
                                    {errorData}
                                </AlertDescription>
                            </div>
                        </Alert>
                    ) : null}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="auth-email">Email</Label>
                        <Input
                            id="auth-email"
                            type="email"
                            required
                            autoFocus
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="auth-password">Password</Label>
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
                            <Label htmlFor="auth-code">Invite code</Label>
                            <Input
                                id="auth-code"
                                required
                                autoComplete="off"
                                spellCheck={false}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                value={code}
                                onChange={(event) => setCode(event.target.value)}
                            />
                            <p className="text-sm text-muted-foreground">
                                Issued for this exact email address, so it will
                                not work with another one.
                            </p>
                        </div>
                    )}
                    <Button type="submit" disabled={submitting}>
                        {submitting
                            ? 'Submitting...'
                            : isSignIn
                            ? 'Sign in'
                            : 'Create account'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="border-t text-sm text-muted-foreground">
                {isSignIn ? (
                    <p>
                        Need an account?{' '}
                        <Link
                            to="/auth/register"
                            className="underline underline-offset-4 hover:text-foreground"
                        >
                            Sign up
                        </Link>
                    </p>
                ) : (
                    <p>
                        Already registered?{' '}
                        <Link
                            to="/auth/login"
                            className="underline underline-offset-4 hover:text-foreground"
                        >
                            Sign in
                        </Link>
                    </p>
                )}
            </CardFooter>
        </Card>
    );
};
