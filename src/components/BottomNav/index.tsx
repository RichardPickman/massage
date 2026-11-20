import {
    BookOpenIcon,
    ExamIcon,
    HouseIcon,
    UserCircleIcon,
} from '@phosphor-icons/react';
import { cn } from 'cn';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
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

    // Shared by the router links and the account button: a tab must look the
    // same whichever element carries it.
    const tabButtonClass = cn(
        'h-auto min-h-14 flex-1 flex-col gap-1 rounded-none px-2 py-2 text-[0.6875rem] tracking-[0.08em] uppercase',
        'text-muted-foreground hover:text-foreground [&[aria-current=page]]:text-foreground'
    );

    return (
        <nav
            aria-label="Primary"
            className="shrink-0 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        >
            <div className="mx-auto flex w-full max-w-6xl items-stretch px-2">
                {tabs.map(({ to, label, icon: Icon, end }) => (
                    <Button
                        key={to}
                        asChild
                        variant="ghost"
                        className={tabButtonClass}
                    >
                        <NavLink to={to} end={end} aria-label={label}>
                            <Icon className="size-5" aria-hidden />
                            <span>{label}</span>
                        </NavLink>
                    </Button>
                ))}
                {user ? (
                    <Dialog
                        open={isAccountOpen}
                        onOpenChange={setIsAccountOpen}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                className={tabButtonClass}
                                aria-label="Account"
                            >
                                <UserCircleIcon
                                    className="size-5"
                                    aria-hidden
                                />
                                <span>Account</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                            <DialogTitle>Account</DialogTitle>
                            <AccountActions
                                onNavigate={() => setIsAccountOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                ) : (
                    <Button asChild variant="ghost" className={tabButtonClass}>
                        <NavLink to="/auth/login" aria-label="Sign in">
                            <UserCircleIcon className="size-5" aria-hidden />
                            <span>Sign in</span>
                        </NavLink>
                    </Button>
                )}
            </div>
        </nav>
    );
};
