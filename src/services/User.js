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
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async login(body) {
        return load({
            url: 'api/users/login',
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

    static async logout(body) {
        return load({
            url: 'api/users/logout',
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

    static async refreshToken() {
        return load({
            url: 'api/users/refresh',
            method: 'GET',
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async getAll() {
        return load({
            url: 'api/users/all',
            method: 'GET',
        })
            .then((res) => res.json())
            .then((res) => res);
    }
}

export default UserService;
