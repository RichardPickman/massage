import { load } from './loader';
import type { RegistrationCode } from './types';

class AdminService {
    // A read: the code lives in the server's environment, so pressing the button
    // twice is harmless, and there is nothing to mint or revoke per person.
    static async registrationCode() {
        return load<RegistrationCode>({
            url: 'admin/registration-code',
            method: 'GET',
        });
    }
}

export default AdminService;
