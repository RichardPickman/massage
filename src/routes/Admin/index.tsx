import { RequireAdmin } from '../../components/RequireAdmin';
import { RequireAuth } from '../../components/RequireAuth';
import { Admin } from '../../pages/Admin';

export const adminRouter = [
    {
        path: 'admin',
        element: (
            <RequireAuth>
                <RequireAdmin>
                    <Admin />
                </RequireAdmin>
            </RequireAuth>
        ),
    },
];
