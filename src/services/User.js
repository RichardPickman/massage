import { load } from './loader';

class UserService {
    static async registration(body) {
        return load({
            url: 'api/users/registration',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    static async login(body) {
        return load({
            url: 'api/users/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    static async logout(body) {
        return load({
            url: 'api/users/logout',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    static async getAll() {
        return load({
            url: 'api/users/all',
            method: 'GET',
        });
    }
}

export default UserService;
