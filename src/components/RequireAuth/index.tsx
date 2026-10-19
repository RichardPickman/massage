import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '../../store';
import { Skeleton } from '../ui/skeleton';
import { toSignInLocationState } from './helpers';

interface RequireAuthProps {
    children: ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
    const { isAuth, isRestoringSession } = useAppSelector(
        (state) => state.auth
    );
    const location = useLocation();

    if (isAuth) {
        return <>{children}</>;
    }

    // Redirecting mid-refresh would flash the sign-in page for a visitor whose
    // stored session is still being checked.
    if (isRestoringSession) {
        return <Skeleton className="h-64 w-full" />;
    }

    const requestedPath = `${location.pathname}${location.search}${location.hash}`;

    return (
        <Navigate
            to="/auth/login"
            replace
            state={toSignInLocationState(requestedPath)}
        />
    );
};
