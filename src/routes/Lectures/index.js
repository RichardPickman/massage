import React from 'react';
import Lectures, { loader as lecturesLoader } from '../../pages/Lectures';
import AddLecture from '../../pages/AddLecture';
import Lecture, { loader as lectureLoader } from '../../pages/Lecture';

export const lectureRouter = {
    path: '/lectures',
    children: [
        {
            index: true,
            element: <Lectures />,
            loader: lecturesLoader,
        },
        {
            path: ':id',
            element: <Lecture />,
            loader: lectureLoader,
        },
        {
            path: 'create',
            element: <AddLecture />,
        },
    ],
};
