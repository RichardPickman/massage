import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { Slot } from 'radix-ui';
import * as React from 'react';

const badgeVariants = cva(
    'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border px-2 py-0.5 text-[0.625rem] font-semibold tracking-widest whitespace-nowrap uppercase transition-[color,box-shadow] [&>svg]:pointer-events-none [&>svg]:size-3',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground',
                outline: 'border-border text-foreground',
                destructive:
                    'border-transparent bg-destructive/10 text-destructive',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

interface BadgeProps
    extends React.ComponentProps<'span'>,
        VariantProps<typeof badgeVariants> {
    asChild?: boolean;
}

function Badge({
    className,
    variant = 'default',
    asChild = false,
    ...props
}: BadgeProps) {
    const Comp = asChild ? Slot.Root : 'span';

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
