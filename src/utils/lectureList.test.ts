import { describe, expect, it } from 'vitest';
import {
    lectureListState,
    lecturesPath,
    readLectureListUrl,
} from './lectureList';

describe('lectureListState', () => {
    it('carries the address of the page it was read on', () => {
        expect(lectureListState('/lectures', '?page=3')).toEqual({
            listUrl: '/lectures?page=3',
        });
    });

    it('carries the bare list when it was read on the first page', () => {
        expect(lectureListState('/lectures', '')).toEqual({
            listUrl: '/lectures',
        });
    });
});

describe('readLectureListUrl', () => {
    it('returns the page the lecture was opened from', () => {
        expect(readLectureListUrl({ listUrl: '/lectures?page=3' })).toBe(
            '/lectures?page=3'
        );
    });

    it('returns the bare list when the lecture was opened from page one', () => {
        expect(readLectureListUrl({ listUrl: lecturesPath })).toBe(
            lecturesPath
        );
    });

    it('falls back to the first page when nothing was carried', () => {
        expect(
            [undefined, null, {}, '/lectures?page=3', 3, ['listUrl']].map(
                (state) => readLectureListUrl(state)
            )
        ).toEqual([
            lecturesPath,
            lecturesPath,
            lecturesPath,
            lecturesPath,
            lecturesPath,
            lecturesPath,
        ]);
    });

    it('ignores state that does not name the list', () => {
        expect(
            [
                { listUrl: '/quiz?page=2' },
                // A lecture or edit address would close the viewer onto itself.
                { listUrl: '/lectures/5' },
                { listUrl: '/lecturesomething' },
                { listUrl: 3 },
                { listUrl: null },
            ].map((state) => readLectureListUrl(state))
        ).toEqual([
            lecturesPath,
            lecturesPath,
            lecturesPath,
            lecturesPath,
            lecturesPath,
        ]);
    });
});
