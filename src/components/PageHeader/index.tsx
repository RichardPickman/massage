import type { ReactNode } from 'react';

import { BackLink } from '../BackLink';

interface PageHeaderProps {
    // The section this page belongs to, in the same small caps voice the overview
    // uses. Skipped where the title already says it.
    kicker?: string;
    title: string;
    description?: string;
    // Right side of the title row: a count, a date, an add button.
    meta?: ReactNode;
    // A way out of a focused screen, above the title.
    back?: { to: string; label: string };
    // Anything that belongs to the header but needs the full width, such as the
    // quiz progress bar.
    children?: ReactNode;
}

// Every page starts the same way: a rule, a title, one line of context. The
// card is for a thing - a question, a score, a form - never for the page itself,
// which is why a page framed in a card looked like a different application.
export const PageHeader = ({
    kicker,
    title,
    description,
    meta,
    back,
    children,
}: PageHeaderProps) => (
    <header className="flex flex-col gap-3 border-b pb-6">
        {back ? <BackLink to={back.to} label={back.label} /> : null}
        {kicker ? (
            <p className="text-[0.625rem] tracking-[0.3em] text-muted-foreground uppercase">
                {kicker}
            </p>
        ) : null}
        <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
                <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                    {title}
                </h1>
                {description ? (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
            {meta}
        </div>
        {children}
    </header>
);
