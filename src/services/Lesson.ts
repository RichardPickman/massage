import { load } from './loader';
import type { Lesson } from './models';

class LessonService {
    static async createLesson(body: {
        title: string;
        time: string;
        days: string[];
    }) {
        return load<Lesson>({
            url: 'lesson/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    static async get(id: string) {
        return load<Lesson>({
            url: `lesson/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async getAllLessons() {
        return load<Lesson[]>({
            url: 'lesson/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async removeLesson(id: string) {
        return load({
            url: `lesson/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async update(body: {
        id: string;
        title: string;
        time: string;
        days: string[];
    }) {
        return load<Lesson>({
            url: `lesson/update/${body.id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }
}

export default LessonService;
