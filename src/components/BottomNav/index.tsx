import {
    BookOpenIcon,
    ExamIcon,
    HouseIcon,
    UserCircleIcon,
} from '@phosphor-icons/react';
import { cn } from 'cn';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useAppSelector } from '../../store';
import { AccountActions } from '../AccountMenu/actions';

const tabs = [
    { to: '/', label: 'Overview', icon: HouseIcon, end: true },
    { to: '/lectures', label: 'Lectures', icon: BookOpenIcon, end: false },
    { to: '/quiz', label: 'Quizzes', icon: ExamIcon, end: false },
];

interface BottomNavProps {
    // The lecture viewer claims the whole viewport for the slides, and auth
    // screens are a single task: neither benefits from a tab bar eating the
    // bottom of the screen.
    hidden?: boolean;
}

export const BottomNav = ({ hidden = false }: BottomNavProps) => {
    const { user } = useAppSelector((state) => state.auth);
    const location = useLocation();
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const onAuthScreen = location.pathname.startsWith('/auth');

    if (hidden || onAuthScreen) {
        return null;
    }

    const tabClass = ({ isActive }: { isActive: boolean }) =>
        cn(
            'flex min-h-14 flex-1 flex-col items-center justify-center gap-1 px-2 text-[0.6875rem] tracking-[0.08em] uppercase transition-colors',
            isActive ? 'text-foreground' : 'text-muted-foreground'
        );

    return (
        <nav
            aria-label="Primary"
            className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        >
            <div className="mx-auto flex w-full max-w-6xl items-stretch px-2">
                {tabs.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={tabClass}
                        aria-label={label}
                    >
                        <Icon className="size-5" aria-hidden />
                        <span>{label}</span>
                    </NavLink>
                ))}
                {user ? (
                    <Dialog
                        open={isAccountOpen}
                        onOpenChange={setIsAccountOpen}
                    >
                        <DialogTrigger asChild>
                            <button
                                type="button"
                                className="flex min-h-14 flex-1 flex-col items-center justify-center gap-1 px-2 text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase transition-colors"
                                aria-label="Account"
                            >
                                <UserCircleIcon
                                    className="size-5"
                                    aria-hidden
                                />
                                <span>Account</span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                            <DialogTitle>Account</DialogTitle>
                            <AccountActions
                                onNavigate={() => setIsAccountOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                ) : (
                    <NavLink
                        to="/auth/login"
                        className={tabClass}
                        aria-label="Sign in"
                    >
                        <UserCircleIcon className="size-5" aria-hidden />
                        <span>Sign in</span>
                    </NavLink>
                )}
            </div>
        </nav>
    );
};
