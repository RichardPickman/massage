import { load } from './loader';

class TeacherService {
    static async createTeacher(body) {
        return load({
            url: 'api/teacher/create',
            method: 'POST',
            body: body,
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async get(id) {
        return load({
            url: `api/teacher/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async getAllTeachers() {
        return load({
            url: 'api/teacher/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async removeTeacher(id) {
        return load({
            url: `api/teacher/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async update(id, body) {
        return load({
            url: `api/teacher/update/${id}`,
            method: 'PUT',
            body: body,
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => res);
    }
}

export default TeacherService;
