import { load } from './loader';
import type { ApiResponse } from './types';
import type { Massage, MassagePayload } from './models';

class MassageService {
    static async createMassage(body: MassagePayload) {
        return load<ApiResponse<Massage>>({
            url: 'massage/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });
    }

    static async getMassage(id: string) {
        return load<ApiResponse<Massage>>({
            url: `massage/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async getAllMassages() {
        return load<ApiResponse<Massage[]>>({
            url: 'massage/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async removeMassage(id: string) {
        return load({
            url: `massage/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
    }
}

export default MassageService;
