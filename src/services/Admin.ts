import { load } from './loader';
import type { Invite } from './types';

class AdminService {
    // Minting is a read: the server stores nothing, so pressing the button twice
    // is harmless and the same address always gets the same code.
    static async invite(email: string) {
        return load<Invite>({
            url: `admin/invites?email=${encodeURIComponent(email)}`,
            method: 'GET',
        });
    }
}

export default AdminService;
