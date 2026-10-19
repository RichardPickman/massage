import { RequireAuth } from '../../components/RequireAuth';
import LecturesLayout from '../../layouts/Lecture';
import { AddLecture } from '../../pages/AddLecture';
import { ErrorPage } from '../../pages/Error';
import { Lecture, loader as lectureLoader } from '../../pages/Lecture';
import { Lectures, loader as lecturesLoader } from '../../pages/Lectures';

export const lectureRouter = [
    {
        path: '/lectures',
        element: <LecturesLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Lectures />,
                loader: lecturesLoader,
            },
            {
                path: 'create',
                element: (
                    <RequireAuth>
                        <AddLecture />
                    </RequireAuth>
                ),
            },
        ],
    },
    {
        path: '/lectures/:id',
        children: [
            {
                index: true,
                element: <Lecture />,
                loader: lectureLoader,
            },
        ],
    },
];
