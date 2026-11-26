import { load } from './loader';
import type { AdminUser, AdminUserPage, RegistrationCode } from './types';

export interface AdminUserChanges {
    user?: string;
    role?: 'user' | 'admin';
    password?: string;
}

class AdminService {
    // A read: the code lives in the server's environment, so pressing the button
    // twice is harmless, and there is nothing to mint or revoke per person.
    static async registrationCode() {
        return load<RegistrationCode>({
            url: 'admin/registration-code',
            method: 'GET',
        });
    }

    static async users({ page, search }: { page: number; search?: string }) {
        const query = new URLSearchParams({ page: String(page) });

        if (search) {
            query.set('search', search);
        }

        return load<AdminUserPage>({
            url: `admin/users?${query.toString()}`,
            method: 'GET',
        });
    }

    static async updateUser(id: string, changes: AdminUserChanges) {
        return load<AdminUser>({
            url: `admin/users/${encodeURIComponent(id)}`,
            method: 'PATCH',
            // The loader sends the body as it is, so a plain object has to be
            // serialised here; `setHeaders` already puts the JSON type on it.
            body: JSON.stringify(changes),
        });
    }

    static async removeUser(id: string) {
        return load<{ id: string }>({
            url: `admin/users/${encodeURIComponent(id)}`,
            method: 'DELETE',
        });
    }
}

export default AdminService;
