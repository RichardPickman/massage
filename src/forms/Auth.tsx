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

    const isSignIn = header === 'Sign In';

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <Card className="mx-auto w-full max-w-md">
            <CardHeader className="border-b">
                <CardTitle>{header}</CardTitle>
                <CardDescription>
                    {isSignIn
                        ? 'Welcome back. Your test record is waiting.'
                        : 'Create an account to keep track of every attempt.'}
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
