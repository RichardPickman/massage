import { beforeEach, describe, expect, it, vi } from 'vitest';
import { load } from './loader';
import LectureService from './Lecture';

vi.mock('./loader', () => ({ load: vi.fn() }));

const loadMock = vi.mocked(load);

// These assertions are the wire contract: a renamed endpoint or a body sent on a GET
// is invisible until the page is opened by hand.
describe('LectureService', () => {
    beforeEach(() => {
        loadMock.mockReset();
        loadMock.mockResolvedValue({} as never);
    });

    it('creates a lecture as multipart', () => {
        const body = new FormData();

        LectureService.createLecture(body);

        expect(loadMock).toHaveBeenCalledWith({
            url: 'lectures/create',
            method: 'POST',
            body,
        });
    });

    it('reads one lecture by id', () => {
        LectureService.getLecture('abc');

        expect(loadMock).toHaveBeenCalledWith({
            url: 'lectures/abc',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('reads one page of lectures', () => {
        LectureService.getLecturesPage(2, 10);

        expect(loadMock).toHaveBeenCalledWith({
            url: 'lectures/all?page=2&limit=10',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('updates a lecture as multipart', () => {
        const body = new FormData();

        LectureService.updateLecture('abc', body);

        expect(loadMock).toHaveBeenCalledWith({
            url: 'lectures/update/abc',
            method: 'PUT',
            body,
        });
    });

    it('removes a lecture', () => {
        LectureService.removeLecture('abc');

        expect(loadMock).toHaveBeenCalledWith({
            url: 'lectures/remove/abc',
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
    });
});
