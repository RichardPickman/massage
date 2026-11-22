import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const { user } = useAppSelector((state) => state.auth);

    if (user?.role !== 'admin') {
        return (
            <Card className="mx-auto w-full max-w-md">
                <CardHeader className="border-b">
                    <CardTitle>{t('admin.noAccess.title')}</CardTitle>
                    <CardDescription>
                        {t('admin.noAccess.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t('admin.noAccess.body')}
                </CardContent>
            </Card>
        );
    }

    return <>{children}</>;
};
