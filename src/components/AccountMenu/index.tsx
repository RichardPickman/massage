import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useAppSelector } from '../../store';
import { AccountActions } from './actions';

export const AccountMenu = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);

    if (!user) {
        return null;
    }

    const initial = user.email.slice(0, 1).toUpperCase();

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="min-h-11 gap-2 pr-3 pl-1"
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
                <AccountActions onNavigate={() => setIsOpen(false)} />
            </PopoverContent>
        </Popover>
    );
};
