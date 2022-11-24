import React from 'react';
import Lectures, { loader as lecturesLoader } from '../../pages/Lectures';
import AddLecture from '../../pages/AddLecture';
import Lecture, { loader as lectureLoader } from '../../pages/Lecture';
import LectureLayout from '../../layouts/Lecture';
import Layout from '../../layouts';

export const lectureRouter = {
    path: '/lectures',
    children: [
        {
            path: 'all',
            element: <Layout />,
            loader: lecturesLoader,
            children: [{ index: true, element: <Lectures /> }],
        },
        {
            path: ':id',
            element: <LectureLayout />,
            loader: lectureLoader,
            children: [{ index: true, element: <Lecture /> }],
        },
        {
            path: 'create',
            element: <Layout />,
            children: [{ index: true, element: <AddLecture /> }],
        },
    ],
};
