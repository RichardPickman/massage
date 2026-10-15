import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import * as React from 'react';

const alertVariants = cva(
    'relative flex w-full items-start gap-3 rounded-none border px-4 py-3 text-sm [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-0.5 [&>svg]:text-current',
    {
        variants: {
            variant: {
                default: 'border-border bg-card text-card-foreground',
                destructive: 'border-destructive/30 bg-card text-destructive',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

function Alert({
    className,
    variant = 'default',
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant, className }))}
            {...props}
        />
    );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-title"
            className={cn('font-medium tracking-tight', className)}
            {...props}
        />
    );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-description"
            className={cn(
                'text-sm text-muted-foreground [&_p]:leading-relaxed',
                className
            )}
            {...props}
        />
    );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
