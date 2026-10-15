import Layout from '../../layouts';
import { ErrorPage } from '../../pages/Error';
import Signin from '../../pages/Signin';
import Signup from '../../pages/Signup';

export const authRouter = {
    path: '/auth',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
        {
            path: 'login',
            element: <Signin />,
        },
        {
            path: 'register',
            element: <Signup />,
        },
        {
            path: 'recover',
        },
    ],
};
