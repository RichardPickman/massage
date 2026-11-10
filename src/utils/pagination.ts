// A page number from the URL. Anything that is not a whole number above zero
// reads as the first page, so a hand-edited or stale link still renders rows
// instead of an error.
export const readPage = (searchParams: URLSearchParams) => {
    const raw = searchParams.get('page');

    if (raw === null) {
        return 1;
    }

    const page = Number(raw);

    return Number.isInteger(page) && page > 0 ? page : 1;
};

// The search string for a page, with the other parameters left alone. Page one
// carries no parameter, so `/lectures` is the only address for it.
export const pageSearch = (searchParams: URLSearchParams, page: number) => {
    const next = new URLSearchParams(searchParams);

    if (page <= 1) {
        next.delete('page');
    } else {
        next.set('page', String(page));
    }

    return next.toString();
};
