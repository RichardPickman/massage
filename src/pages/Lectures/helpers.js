import React from 'react';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const columns = [
    {
        field: 'topic',
        headerName: 'Topic',
        flex: 1,
        renderCell: (params) => (
            <Link to={`/lectures/${params.row.id}`} component={RouterLink}>
                {params.row.topic}
            </Link>
        ),
    },
    {
        field: 'lesson',
        headerName: 'Lesson',
        flex: 1,
        renderCell: ({ row: { lesson } }) => {
            return lesson.title;
        },
    },
    { field: 'date', headerName: 'Date', flex: 1 },
    {
        field: 'teacher',
        headerName: 'Teacher',
        flex: 1,
        renderCell: ({ row: { teacher } }) => {
            return teacher.firstName + ' ' + teacher.lastName;
        },
    },
];

export const getTableRows = (payload) => {
    const result = [];

    for (let lecture of payload) {
        result.push({
            id: lecture._id,
            topic: lecture.topic,
            lesson: lecture.lesson,
            date: lecture.date,
            teacher: lecture.teacher,
        });
    }

    return result;
};
