import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { fetchLogout } from '../../store/reducers/auth/fetch';

export const AccountMenu = () => {
    const { user } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (!user) {
        return null;
    }

    const initial = user.email.slice(0, 1).toUpperCase();
    const isAdmin = user.role === 'admin';

    const handleAdminPanel = () => {
        setIsOpen(false);
        navigate('/admin', { replace: true });
    };

    const handleLogout = () => {
        setIsOpen(false);
        dispatch(fetchLogout());
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[0.625rem]">
                        {initial}
                    </span>
                    <span className="normal-case tracking-normal">
                        {user.email}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 gap-1 p-2">
                <div className="flex flex-col px-2 py-1.5">
                    <span className="text-[0.625rem] tracking-widest text-muted-foreground uppercase">
                        Signed in as
                    </span>
                    <span className="truncate">{user.email}</span>
                </div>
                <div className="h-px bg-foreground/10" />
                {isAdmin && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                        onClick={handleAdminPanel}
                    >
                        Admin panel
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={handleLogout}
                >
                    Log out
                </Button>
            </PopoverContent>
        </Popover>
    );
};
