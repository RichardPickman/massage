import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchLogout } from '../../store/reducers/auth/fetch';

interface AccountActionsProps {
    // Called before navigating, so the surface holding these actions (popover or
    // sheet) can close itself instead of staying open over the next page.
    onNavigate?: () => void;
}

// One source for "who am I / what can I do / log out", used by the header
// popover and the mobile sheet. Two copies would drift the moment one of them
// gains an entry.
export const AccountActions = ({ onNavigate }: AccountActionsProps) => {
    const { t } = useTranslation();
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    if (!user) {
        return null;
    }

    const close = () => onNavigate?.();

    const handleLogout = () => {
        close();
        dispatch(fetchLogout());
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-col px-2 py-1.5">
                <span className="text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
                    {t('account.signedInAs')}
                </span>
                {/* The nickname is the name; the address is what signing in uses,
                    and an account made before nicknames existed shows only it. */}
                <span className="truncate font-medium">
                    {user.nickname || user.email}
                </span>
                {user.nickname ? (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                ) : null}
            </div>
            <div className="h-px bg-foreground/10" />
            {user.role === 'admin' ? (
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="min-h-11 justify-start"
                >
                    <Link to="/admin" onClick={close}>
                        {t('account.inviteCodes')}
                    </Link>
                </Button>
            ) : null}
            <Button
                asChild
                variant="ghost"
                size="sm"
                className="min-h-11 justify-start"
            >
                <Link to="/" onClick={close}>
                    {t('account.statsOverview')}
                </Link>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="min-h-11 justify-start"
                onClick={handleLogout}
            >
                {t('account.logOut')}
            </Button>
            <div className="h-px bg-foreground/10" />
            <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                <span className="text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
                    {t('common.language')}
                </span>
                <LanguageSwitch />
            </div>
        </div>
    );
};
