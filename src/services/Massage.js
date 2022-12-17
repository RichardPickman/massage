import { load } from './loader';

class MassageService {
    static async createMassage(body) {
        return load({
            url: 'api/massage/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    static async getMassage(id) {
        return load({
            url: `api/massage/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async getAllMassages() {
        return load({
            url: 'api/massage/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async removeMassage(id) {
        return load({
            url: `api/massage/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export default MassageService;
