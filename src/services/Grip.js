import { load } from './loader';

class GripService {
    static async createGrip(body) {
        return load({
            url: 'api/grips/create',
            method: 'POST',
            body: body,
        });
    }

    static async getAllGrips() {
        return load({
            url: 'api/grips/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async removeGrip(id) {
        return load({
            url: `api/grips/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export default GripService;
