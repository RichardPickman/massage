import jwtDecode from 'jwt-decode';

export interface AuthUser {
    id: string;
    email: string;
    role: string;
    // Accounts made before nicknames existed carry null here; the screens fall
    // back to the address.
    nickname?: string | null;
}

export const getUserFromToken = (token: string): AuthUser | null => {
    try {
        const { id, email, role, nickname } = jwtDecode<AuthUser>(token);

        if (!id || !email || !role) {
            return null;
        }

        return { id, email, role, nickname: nickname ?? null };
    } catch {
        return null;
    }
};
