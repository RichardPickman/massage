import { cn } from 'cn';
import { Outlet, useMatches } from 'react-router-dom';

import { BottomNav } from '../components/BottomNav';
import { Header } from '../components/Header';

// A route can claim the whole screen below the header. Such a page owns its own
// spacing and the decorative footer steps aside, so nothing sits between a
// full-height page and the bottom of the viewport.
interface RouteHandle {
    fullBleed?: boolean;
}

const claimsFullScreen = (handles: unknown[]) =>
    handles.some((handle) =>
        Boolean((handle as RouteHandle | null)?.fullBleed)
    );

export const Layout = () => {
    const fullBleed = claimsFullScreen(
        useMatches().map((match) => match.handle)
    );

    return (
        <div className="flex min-h-dvh flex-col bg-background pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
            <Header />
            <main
                className={cn(
                    'mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6 lg:px-8',
                    fullBleed ? 'py-4 sm:py-10' : 'py-10'
                )}
            >
                <Outlet />
            </main>
            {fullBleed ? null : (
                <footer className="border-t">
                    <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                        <span>RP · Massage</span>
                        <span>Lecture notes &amp; tests</span>
                    </div>
                </footer>
            )}
            <BottomNav hidden={fullBleed} />
        </div>
    );
};
