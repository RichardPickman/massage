import { ArrowLeftIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { cn } from 'cn';

interface BackLinkProps {
    to: string;
    label: string;
    className?: string;
}

// Leaving a screen must be a visible door, not a gesture the platform happens to
// provide: on a phone the system back gesture is the only way out of a test or a
// lecture otherwise, and nothing on screen says so. The negative margin pulls the
// label back to the text edge of the card, since the ghost button carries its own
// padding.
export const BackLink = ({ to, label, className }: BackLinkProps) => (
    <Button
        asChild
        variant="ghost"
        size="sm"
        className={cn(
            '-ml-2 min-h-11 w-fit text-muted-foreground hover:text-foreground md:min-h-8',
            className
        )}
    >
        <Link to={to}>
            <ArrowLeftIcon className="size-4" />
            {label}
        </Link>
    </Button>
);
