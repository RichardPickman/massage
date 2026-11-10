import { Outlet } from 'react-router-dom';

import { Header } from '../components/Header';

export const Layout = () => {
    return (
        <div className="flex min-h-dvh flex-col bg-background">
            <Header />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
                <Outlet />
            </main>
            <footer className="border-t">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <span>RP · Massage</span>
                    <span>Lecture notes &amp; tests</span>
                </div>
            </footer>
        </div>
    );
};
