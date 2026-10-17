import { createBrowserRouter } from 'react-router-dom';
import { authRouter } from './Auth';
import { lectureRouter } from './Lectures';
import { quizRouter } from './Quiz';

import Layout from '../layouts';
import { ErrorPage } from '../pages/Error';
import Home from '../pages/Home';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },
    ...lectureRouter,
    quizRouter,
    authRouter,
]);

export default router;
