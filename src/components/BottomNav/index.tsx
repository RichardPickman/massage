import {
    BookOpenIcon,
    ExamIcon,
    HouseIcon,
    UserCircleIcon,
} from '@phosphor-icons/react';
import { cn } from 'cn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    { to: '/', labelKey: 'nav.overview', icon: HouseIcon, end: true },
    {
        to: '/lectures',
        labelKey: 'nav.lectures',
        icon: BookOpenIcon,
        end: false,
    },
    { to: '/quiz', labelKey: 'nav.quizzes', icon: ExamIcon, end: false },
] as const;

interface BottomNavProps {
    // The lecture viewer claims the whole viewport for the slides, and auth
    // screens are a single task: neither benefits from a tab bar eating the
    // bottom of the screen.
    hidden?: boolean;
}

export const BottomNav = ({ hidden = false }: BottomNavProps) => {
    const { t } = useTranslation();
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
            aria-label={t('nav.primary')}
            className="shrink-0 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        >
            <div className="mx-auto flex w-full max-w-6xl items-stretch px-2">
                {tabs.map(({ to, labelKey, icon: Icon, end }) => (
                    <Button
                        key={to}
                        asChild
                        variant="ghost"
                        className={tabButtonClass}
                    >
                        <NavLink to={to} end={end} aria-label={t(labelKey)}>
                            <Icon className="size-5" aria-hidden />
                            <span>{t(labelKey)}</span>
                        </NavLink>
                    </Button>
                ))}
                {user ? (
                    <Dialog
                        open={isAccountOpen}
                        onOpenChange={setIsAccountOpen}
                    >
                        <DialogTrigger asChild>
                            <Button variant="ghost" className={tabButtonClass}>
                                <UserCircleIcon
                                    className="size-5"
                                    aria-hidden
                                />
                                <span>{t('account.menu')}</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                            <DialogTitle>{t('account.menu')}</DialogTitle>
                            <AccountActions
                                onNavigate={() => setIsAccountOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                ) : (
                    <Button asChild variant="ghost" className={tabButtonClass}>
                        <NavLink to="/auth/login">
                            <UserCircleIcon className="size-5" aria-hidden />
                            <span>{t('auth.signIn')}</span>
                        </NavLink>
                    </Button>
                )}
            </div>
        </nav>
    );
};
