import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchLogout } from '../../store/reducers/auth/fetch';

export const AccountMenu = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    if (!user) {
        return null;
    }

    const initial = user.email.slice(0, 1).toUpperCase();

    const handleLogout = () => {
        setIsOpen(false);
        dispatch(fetchLogout());
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 pr-3 pl-1"
                    aria-label={`Account menu for ${user.email}`}
                >
                    <Avatar className="size-7">
                        <AvatarFallback>{initial}</AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-40 truncate normal-case tracking-normal md:inline">
                        {user.email}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60 gap-1 p-2">
                <div className="flex flex-col px-2 py-1.5">
                    <span className="text-[0.625rem] tracking-widest text-muted-foreground uppercase">
                        Signed in as
                    </span>
                    <span className="truncate">{user.email}</span>
                </div>
                <div className="h-px bg-foreground/10" />
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                >
                    <Link to="/" onClick={() => setIsOpen(false)}>
                        Stats overview
                    </Link>
                </Button>
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
