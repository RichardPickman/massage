import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { quizRouter } from './Quiz';
import { lectureRouter } from './Lectures';
import { massageRouter } from './Massage';
import { authRouter } from './Auth';
import { adminRouter } from './Admin';

import Layout from '../layouts';
import Home from '../pages/Home';
import Error from '../pages/Error';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },
    ...lectureRouter,
    adminRouter,
    quizRouter,
    massageRouter,
    authRouter,
]);

export default router;
