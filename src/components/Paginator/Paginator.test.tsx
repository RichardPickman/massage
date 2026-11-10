import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { makeStore, renderWithProviders } from '../../test/helpers';
import { Paginator } from '.';

const renderPaginator = (page: number, pages: number, route = '/lectures') =>
    renderWithProviders(<Paginator page={page} pages={pages} />, {
        store: makeStore(),
        route,
    });

describe('Paginator', () => {
    it('hides itself when everything fits on one page', () => {
        const { container } = renderPaginator(1, 1);

        expect(container).toBeEmptyDOMElement();
    });

    it('shows the position between both controls', () => {
        renderPaginator(2, 3);

        const status = screen.getByText('Page 2 of 3');

        expect(status).toHaveAttribute('aria-current', 'page');
        expect(
            screen.getByRole('link', { name: 'Go to previous page' })
        ).toHaveAttribute('href', '/lectures');
        expect(
            screen.getByRole('link', { name: 'Go to next page' })
        ).toHaveAttribute('href', '/lectures?page=3');
    });

    it('disables the previous control on the first page', () => {
        renderPaginator(1, 3);

        expect(
            screen.getByRole('link', { name: 'Go to previous page' })
        ).toHaveAttribute('aria-disabled', 'true');
        expect(
            screen.getByRole('link', { name: 'Go to next page' })
        ).toHaveAttribute('href', '/lectures?page=2');
    });

    it('disables the next control on the last page', () => {
        renderPaginator(3, 3);

        expect(
            screen.getByRole('link', { name: 'Go to next page' })
        ).toHaveAttribute('aria-disabled', 'true');
        expect(
            screen.getByRole('link', { name: 'Go to previous page' })
        ).toHaveAttribute('href', '/lectures?page=2');
    });

    it('keeps the other query parameters on both controls', () => {
        renderPaginator(2, 3, '/lectures?sort=topic');

        expect(
            screen.getByRole('link', { name: 'Go to previous page' })
        ).toHaveAttribute('href', '/lectures?sort=topic');
        expect(
            screen.getByRole('link', { name: 'Go to next page' })
        ).toHaveAttribute('href', '/lectures?sort=topic&page=3');
    });
});
