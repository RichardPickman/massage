import type { ReactNode } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAppSelector } from '../../store';

interface RequireAdminProps {
    children: ReactNode;
}

// Signed-out visitors are handled by RequireAuth around this, so there is only
// one case left to answer here: someone who is signed in but is not an admin.
// Refusing beats redirecting them to a page that says the same thing.
export const RequireAdmin = ({ children }: RequireAdminProps) => {
    const { user } = useAppSelector((state) => state.auth);

    if (user?.role !== 'admin') {
        return (
            <Card className="mx-auto w-full max-w-md">
                <CardHeader className="border-b">
                    <CardTitle>Not your area</CardTitle>
                    <CardDescription>
                        Invite codes are minted by the site&apos;s admin. Your
                        account can read lectures and take tests.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    If you were expecting access, ask whoever invited you.
                </CardContent>
            </Card>
        );
    }

    return <>{children}</>;
};
