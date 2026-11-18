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

    it('tightens the padding so a full-screen page starts higher up', async () => {
        renderLayout({ fullBleed: true });

        const main = (await screen.findByText('page')).closest('main');

        expect(main).toHaveClass('py-4');
        expect(main).not.toHaveClass('py-10');
    });
});
