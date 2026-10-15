import { load } from './loader';
import type { Teacher } from './models';

class TeacherService {
    static async createTeacher(body: FormData) {
        return load<Teacher>({
            url: 'teacher/create',
            method: 'POST',
            body: body,
        });
    }

    static async get(id: string) {
        return load<Teacher>({
            url: `teacher/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async getAllTeachers() {
        return load<Teacher[]>({
            url: 'teacher/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async removeTeacher(id: string) {
        return load({
            url: `teacher/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async update(id: string, body: FormData) {
        return load<Teacher>({
            url: `teacher/update/${id}`,
            method: 'PUT',
            body: body,
        });
    }
}

export default TeacherService;
