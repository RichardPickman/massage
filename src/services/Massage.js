import { load } from './loader';

class MassageService {
    static async createMassage(body) {
        return load({
            url: 'api/massage/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async getMassage(id) {
        return load({
            url: `api/massage/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async getAllMassages() {
        return load({
            url: 'api/massage/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async removeMassage(id) {
        return load({
            url: `api/massage/remove/${id}`,
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

export default MassageService;
