import { load } from './loader';

class LectureService {
    static async createLecture(body) {
        return load({
            url: 'api/lectures/create',
            method: 'POST',
            body: body,
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async getLecture(id) {
        return load({
            url: `api/lectures/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async getAllLectures() {
        return load({
            url: 'api/lectures/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async removeLecture(id) {
        return load({
            url: `api/lectures/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => res);
    }
}

export default LectureService;
