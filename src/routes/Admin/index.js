import React from 'react';

import AdminLayout from '../../layouts/Admin';
import Error from '../../pages/Error';
import Teachers, {
    loader as teachersLoader,
} from '../../pages/Admin/Teachers/AllTeachers';
import Lessons, { loader as lessonsLoader } from '../../pages/Admin/Lessons';
import NewTeacher, {
    loader as allLessonsLoader,
} from '../../pages/Admin/Teachers/NewTeacher';
import EditTeacher, {
    loader as editLoader,
} from '../../pages/Admin/Teachers/EditTeacher';
import Users, { loader as usersLoader } from '../../pages/Admin/Users';
import Grips from '../../pages/Admin/Grips';
import AddLesson, {
    loader as addLessonLoader,
} from '../../pages/Admin/Lessons/AddLesson';
import Calendar, { loader as calendarLoader } from '../../pages/Admin/Calendar';

export const adminRouter = {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <Error />,
    children: [
        {
            index: true,
            path: 'users',
            element: <Users />,
            loader: usersLoader,
        },
        {
            path: 'teachers',
            element: <Teachers />,
            loader: teachersLoader,
        },
        {
            path: 'teachers/new',
            element: <NewTeacher />,
            loader: lessonsLoader,
        },
        {
            path: 'teachers/edit/:id',
            element: <EditTeacher />,
            loader: editLoader,
        },
        {
            path: 'grips',
            element: <Grips />,
        },
        {
            path: 'lessons',
            element: <Lessons />,
            loader: allLessonsLoader,
        },
        {
            path: 'lessons/add',
            element: <AddLesson />,
            loader: addLessonLoader,
        },
        {
            path: 'calendar',
            element: <Calendar />,
            loader: calendarLoader,
        },
    ],
};
