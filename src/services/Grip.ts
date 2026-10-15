import { load } from './loader';
import type { Grip } from './models';

class GripService {
    static async createGrip(body: { title: string }) {
        return load<Grip>({
            url: 'grips/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            credentials: 'include',
        });
    }

    static async getAllGrips() {
        const response = await load<{ payload: Grip[] }>({
            url: 'grips/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.payload;
    }

    static async removeGrip(id: string) {
        return load({
            url: `grips/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
    }

    static async update(body: { id: string; title: string }) {
        return load<Grip>({
            url: `grips/update/${body.id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            credentials: 'include',
        });
    }
}

export default GripService;
