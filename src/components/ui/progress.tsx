import { cn } from 'cn';
import { Progress as ProgressPrimitive } from 'radix-ui';
import * as React from 'react';

function Progress({
    className,
    value,
    ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn(
                'relative flex h-2 w-full items-center overflow-hidden bg-muted',
                className
            )}
            value={value}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className="h-full w-full flex-1 bg-primary transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };
