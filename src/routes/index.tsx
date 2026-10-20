import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '../layouts';
import { ErrorPage } from '../pages/Error';
import { StatsPage } from '../pages/Stats';
import { authRouter } from './Auth';
import { lectureRouter } from './Lectures';
import { quizRouter } from './Quiz';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <StatsPage />,
            },
            ...lectureRouter,
            ...quizRouter,
            ...authRouter,
        ],
    },
]);

export default router;
