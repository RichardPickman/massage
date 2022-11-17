import React from 'react';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const columns = [
    {
        field: 'topic',
        headerName: 'Topic',
        width: 300,
        renderCell: (params) => (
            <Link to={`/lectures/${params.row.id}`} component={RouterLink}>
                {params.row.topic}
            </Link>
        ),
    },
    { field: 'lesson', headerName: 'Lesson', width: 200 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'teacher', headerName: 'Teacher', width: 150 },
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
