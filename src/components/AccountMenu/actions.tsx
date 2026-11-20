import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
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
                    Signed in as
                </span>
                <span className="truncate">{user.email}</span>
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
                        Invite codes
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
                    Stats overview
                </Link>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="min-h-11 justify-start"
                onClick={handleLogout}
            >
                Log out
            </Button>
        </div>
    );
};
