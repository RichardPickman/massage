import { screen } from '@testing-library/react';
import type { RouteObject } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { makeStore, renderWithDataRouter } from '../test/helpers';
import { Layout } from '.';

// The layout decides from the route handle, so the tests mount it as the real
// router does rather than rendering it in isolation.
const routes = (handle?: { fullBleed: boolean }): RouteObject[] => [
    {
        path: '/',
        element: <Layout />,
        children: [{ index: true, element: <p>page</p>, handle }],
    },
];

const renderLayout = (handle?: { fullBleed: boolean }) =>
    renderWithDataRouter(routes(handle), { store: makeStore() });

describe('Layout', () => {
    it('closes an ordinary page with the site footer', async () => {
        renderLayout();

        expect(await screen.findByText('page')).toBeInTheDocument();
        expect(screen.getByText('Lecture notes & tests')).toBeInTheDocument();
    });

    it('steps aside for a page that claims the whole screen', async () => {
        renderLayout({ fullBleed: true });

        expect(await screen.findByText('page')).toBeInTheDocument();
        expect(
            screen.queryByText('Lecture notes & tests')
        ).not.toBeInTheDocument();
    });

    it('hands a full-screen page a column that can grow', async () => {
        renderLayout({ fullBleed: true });

        const main = (await screen.findByText('page')).closest('main');

        expect(main).toHaveClass('flex-1', 'flex-col');
    });

    it('keeps the tab bar on screen as a row, not as an overlay on the document', async () => {
        renderLayout();

        const nav = await screen.findByRole('navigation', {
            name: 'Primary',
        });

        // A fixed bar over a scrolling document is what let the bar drift out of
        // the viewport; the shell owns the height and the bar is one of its rows.
        expect(nav).not.toHaveClass('fixed');
        expect(nav).toHaveClass('shrink-0');
        expect(nav.parentElement).toHaveClass('h-dvh', 'overflow-hidden');
    });

    it('scrolls the middle column instead of the document', async () => {
        renderLayout();

        const main = (await screen.findByText('page')).closest('main');

        expect(main).toHaveClass('overflow-y-auto');
    });

    it('drops the header on a phone, where the tabs already lead to the same pages', async () => {
        renderLayout();

        const header = (await screen.findByText('page'))
            .closest('main')
            ?.parentElement?.querySelector('header');

        expect(header?.parentElement).toHaveClass('hidden', 'md:block');
    });

    it('tightens the padding so a full-screen page starts higher up', async () => {
        renderLayout({ fullBleed: true });

        const main = (await screen.findByText('page')).closest('main');

        expect(main).toHaveClass('py-4');
        expect(main).not.toHaveClass('py-10');
    });
});
