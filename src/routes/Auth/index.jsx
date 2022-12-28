import React from 'react';
import Error from '../../pages/Error';
import Signin from '../../pages/Signin';
import Signup from '../../pages/Signup';
import Layout from '../../layouts';

export const authRouter = {
    path: '/auth',
    element: <Layout />,
    errorElement: <Error />,
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
