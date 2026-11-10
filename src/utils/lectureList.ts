// A lecture opened from the list carries the list's own URL in router state, so
// closing it returns to the page it came from. State is not shareable and does
// not survive a refresh, which is why every reader falls back to the first page.
export const lecturesPath = '/lectures';

export interface LectureListState {
    listUrl: string;
}

// The list itself, or one of its queries. A lecture or edit address is not a
// list, and returning to one would send the viewer back to where it already is.
const isListUrl = (value: unknown): value is string =>
    typeof value === 'string' &&
    (value === lecturesPath || value.startsWith(`${lecturesPath}?`));

export const readLectureListUrl = (state: unknown) => {
    if (typeof state !== 'object' || state === null || !('listUrl' in state)) {
        return lecturesPath;
    }

    const { listUrl } = state;

    return isListUrl(listUrl) ? listUrl : lecturesPath;
};

export const lectureListState = (
    pathname: string,
    search: string
): LectureListState => ({
    listUrl: `${pathname}${search}`,
});
