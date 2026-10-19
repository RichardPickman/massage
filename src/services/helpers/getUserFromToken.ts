import jwtDecode from 'jwt-decode';

export interface AuthUser {
    id: string;
    email: string;
    role: string;
}

export const getUserFromToken = (token: string): AuthUser | null => {
    try {
        const { id, email, role } = jwtDecode<AuthUser>(token);

        if (!id || !email || !role) {
            return null;
        }

        return { id, email, role };
    } catch {
        return null;
    }
};
