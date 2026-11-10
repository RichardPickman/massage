import { load } from './loader';
import type { ApiResponse, Page } from './types';
import type { Lecture, LectureDetails } from './models';

class LectureService {
    static async createLecture(body: FormData) {
        return load<ApiResponse<Lecture>>({
            url: 'lectures/create',
            method: 'POST',
            body: body,
        });
    }

    static async getLecture(id: string) {
        return load<ApiResponse<LectureDetails>>({
            url: `lectures/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // One page at a time; the API answers with the clamped page, which is how
    // the list learns its request landed past the end.
    static async getLecturesPage(page: number, limit: number) {
        return load<ApiResponse<Page<Lecture>>>({
            url: `lectures/all?page=${page}&limit=${limit}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Multipart, because a new image arrives alongside the fields.
    static async updateLecture(id: string, body: FormData) {
        return load<ApiResponse<Lecture>>({
            url: `lectures/update/${id}`,
            method: 'PUT',
            body: body,
        });
    }

    static async removeLecture(id: string) {
        return load<ApiResponse<Lecture>>({
            url: `lectures/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export default LectureService;
