import Signin from '../../pages/Signin';
import Signup from '../../pages/Signup';

export const authRouter = [
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                element: <Signin />,
            },
            {
                path: 'register',
                element: <Signup />,
            },
        ],
    },
];
