import { describe, expect, it } from 'vitest';
import { pageSearch, readPage } from './pagination';

const params = (search: string) => new URLSearchParams(search);

describe('readPage', () => {
    it('reads the first page when there is no parameter', () => {
        expect(readPage(params(''))).toBe(1);
    });

    it('reads a whole page number above zero', () => {
        expect(readPage(params('page=4'))).toBe(4);
    });

    it('reads anything else as the first page', () => {
        expect(
            [
                'page=abc',
                'page=0',
                'page=-2',
                'page=1.5',
                'page=',
                'page=NaN',
            ].map((search) => readPage(params(search)))
        ).toEqual([1, 1, 1, 1, 1, 1]);
    });
});

describe('pageSearch', () => {
    it('sets the requested page', () => {
        expect(pageSearch(params(''), 3)).toBe('page=3');
    });

    it('leaves page one out of the address', () => {
        expect(pageSearch(params('page=4'), 1)).toBe('');
    });

    it('keeps the other parameters', () => {
        expect(pageSearch(params('sort=topic&page=4&q=ana'), 2)).toBe(
            'sort=topic&page=2&q=ana'
        );
    });
});
