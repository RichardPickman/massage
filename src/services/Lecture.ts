import { load } from './loader';
import type { ApiResponse } from './types';
import type { Lecture, LectureImages } from './models';

class LectureService {
    static async createLecture(body: FormData) {
        return load<ApiResponse<Lecture>>({
            url: 'lectures/create',
            method: 'POST',
            body: body,
        });
    }

    static async getLecture(id: string) {
        return load<ApiResponse<LectureImages>>({
            url: `lectures/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async getAllLectures() {
        return load<ApiResponse<Lecture[]>>({
            url: 'lectures/all',
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
