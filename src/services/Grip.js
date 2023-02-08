import { load } from './loader';

class GripService {
    static async createGrip(body) {
        return load({
            url: 'api/grips/create',
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

    static async getAllGrips() {
        return load({
            url: 'api/grips/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async removeGrip(id) {
        return load({
            url: `api/grips/remove/${id}`,
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
            url: `api/grips/update/${body.id}`,
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

export default GripService;
