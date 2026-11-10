import { cn } from 'cn';
import { Link, NavLink } from 'react-router-dom';

import { useAppSelector } from '../../store';
import { AccountMenu } from '../AccountMenu';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { paths } from './paths';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
        'py-1 text-xs font-semibold tracking-widest uppercase transition-colors hover:text-foreground',
        isActive
            ? 'text-foreground underline decoration-primary decoration-2 underline-offset-[10px]'
            : 'text-muted-foreground'
    );

export const Header = () => {
    const { isAuth, isRestoringSession } = useAppSelector(
        (state) => state.auth
    );

    return (
        <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-5 px-4 sm:gap-8 sm:px-6 lg:px-8">
                <Link
                    to="/"
                    aria-label="RP Massage home"
                    className="flex items-center gap-3"
                >
                    <span className="flex size-9 items-center justify-center bg-primary text-[0.625rem] font-semibold tracking-[0.2em] text-primary-foreground">
                        RP
                    </span>
                </Link>
                <nav
                    aria-label="Main"
                    className="flex items-center gap-4 sm:gap-6"
                >
                    {paths.map((item) => {
                        if (item.authRequired && !isAuth) {
                            return null;
                        }

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                className={({ isActive }) =>
                                    cn(
                                        navLinkClass({ isActive }),
                                        item.path === '/' && 'hidden sm:inline'
                                    )
                                }
                            >
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>
                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    {isRestoringSession ? (
                        <Skeleton className="h-9 w-20" />
                    ) : isAuth ? (
                        <AccountMenu />
                    ) : (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link to="/auth/login">Sign in</Link>
                            </Button>
                            <Button
                                asChild
                                size="sm"
                                className="hidden sm:inline-flex"
                            >
                                <Link to="/auth/register">Sign up</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
