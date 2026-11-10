import { cn } from 'cn';
import { Slot } from 'radix-ui';
import * as React from 'react';
import { buttonVariants, type Button } from './button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
    <nav
        role="navigation"
        aria-label="pagination"
        data-slot="pagination"
        className={cn('mx-auto flex w-full justify-center', className)}
        {...props}
    />
);

const PaginationContent = ({
    className,
    ...props
}: React.ComponentProps<'ul'>) => (
    <ul
        data-slot="pagination-content"
        className={cn('flex flex-row items-center gap-1', className)}
        {...props}
    />
);

const PaginationItem = (props: React.ComponentProps<'li'>) => (
    <li data-slot="pagination-item" {...props} />
);

interface PaginationLinkProps
    extends React.ComponentProps<'a'>,
        Pick<React.ComponentProps<typeof Button>, 'size'> {
    isActive?: boolean;
    // Pages are router links here, so the anchor is only a fallback.
    asChild?: boolean;
}

const PaginationLink = ({
    className,
    isActive,
    size = 'icon',
    asChild = false,
    ...props
}: PaginationLinkProps) => {
    const Comp = asChild ? Slot.Root : 'a';

    return (
        <Comp
            aria-current={isActive ? 'page' : undefined}
            data-slot="pagination-link"
            data-active={isActive}
            className={cn(
                buttonVariants({
                    variant: isActive ? 'outline' : 'ghost',
                    size,
                }),
                className
            )}
            {...props}
        />
    );
};

export { Pagination, PaginationContent, PaginationItem, PaginationLink };
