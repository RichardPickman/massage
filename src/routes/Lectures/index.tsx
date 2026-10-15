import LecturesLayout from '../../layouts/Lecture';
import { AddLecture, loader as addLectureLoader } from '../../pages/AddLecture';
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
                element: <AddLecture />,
                loader: addLectureLoader,
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
