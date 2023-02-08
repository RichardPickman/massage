import { load } from './loader';

class LessonService {
    static async createLesson(body) {
        return load({
            url: 'api/lesson/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async get(id) {
        return load({
            url: `api/lesson/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async getAllLessons() {
        return load({
            url: 'api/lesson/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async removeLesson(id) {
        return load({
            url: `api/lesson/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async update(body) {
        return load({
            url: `api/lesson/update/${body.id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => res);
    }
}

export default LessonService;
