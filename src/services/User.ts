import { load } from './loader';

class UserService {
    static async registration(body: Record<string, unknown>) {
        return load<{ token: string }>({
            url: 'users/registration',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    static async login(body: Record<string, unknown>) {
        return load<{ token: string }>({
            url: 'users/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    // The token travels in the Authorization header, which `load` attaches
    // from storage, so the call needs no body of its own.
    static async logout() {
        return load({
            url: 'users/logout',
            method: 'POST',
        });
    }

    static async refreshToken() {
        return load<{ token: string }>({
            url: 'users/auth',
            method: 'GET',
        });
    }

    // static async getAll() {
    //     return load({
    //         url: 'users/all',
    //         method: 'GET',
    //     });
    // }
}

export default UserService;
