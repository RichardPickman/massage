import { load } from './loader';

class LectureService {
    static async createLecture(body) {
        return load({
            url: 'api/lectures/create',
            method: 'POST',
            body: body,
        });
    }

    static async getLecture(id) {
        return load({
            url: `api/lectures/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async getAllLectures() {
        return load({
            url: 'api/lectures/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async removeLecture(id) {
        return load({
            url: `api/lectures/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export default LectureService;
