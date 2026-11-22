import { cn } from 'cn';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useMatches } from 'react-router-dom';

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

// The shell, not the document, owns the height: header and tab bar are rows that
// never leave the screen, and only the middle column scrolls. Scrolling the
// document instead is what put the tab bar "under the page" - a fixed bar over a
// document scroll is a promise the browser only keeps while nothing else claims
// the viewport.
export const Layout = () => {
    const { t } = useTranslation();
    const fullBleed = claimsFullScreen(
        useMatches().map((match) => match.handle)
    );
    const location = useLocation();
    const scrollArea = useRef<HTMLElement>(null);

    // A new route starts at the top of its own column. Without this the scroll
    // position carries over, because the window no longer scrolls.
    useEffect(() => {
        scrollArea.current?.scrollTo?.({ top: 0 });
    }, [location.key]);

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-background">
            {/* On a phone the tab bar already carries these destinations, and the
                header would only cost the screen 64px plus the one link it holds. */}
            <div className="hidden md:block">
                <Header />
            </div>
            <main
                ref={scrollArea}
                className={cn(
                    'mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-y-auto overscroll-contain px-4 [&>*]:shrink-0 sm:px-6 lg:px-8',
                    fullBleed ? 'py-4 sm:py-10' : 'py-6 sm:py-10'
                )}
            >
                <Outlet />
            </main>
            {fullBleed ? null : (
                <footer className="hidden border-t md:block">
                    <div className="mx-auto flex w-full max-w-6xl flex-row items-center justify-between px-4 py-3 text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase sm:px-6 lg:px-8">
                        <span>{t('footer.brand')}</span>
                        <span>{t('footer.tagline')}</span>
                    </div>
                </footer>
            )}
            <BottomNav hidden={fullBleed} />
        </div>
    );
};
