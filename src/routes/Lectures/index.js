import React from 'react';
import AddLecture, { loader as addLectureLoader } from '../../pages/AddLecture';
import Lectures, { loader as lecturesLoader } from '../../pages/Lectures';
import Lecture, { loader as lectureLoader } from '../../pages/Lecture';
import LecturesLayout from '../../layouts/Lecture';
import Error from '../../pages/Error';

export const lectureRouter = [
    {
        path: '/lectures',
        element: <LecturesLayout />,
        errorElement: <Error />,
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
