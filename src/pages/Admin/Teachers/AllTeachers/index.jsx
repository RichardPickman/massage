import React, { useLayoutEffect } from 'react';
import { Box, Button, Grid, Stack } from '@mui/material';
import { useLoaderData, useNavigate } from 'react-router-dom';

import Card from './showCard';
import TeacherService from '../../../../services/Teacher';
import PageHeader from '../../helpers/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRemove } from '../../../../store/reducers/teachers/fetch';
import { setTeachers } from '../../../../store/reducers/teachers';

function Teachers() {
    const { teachers } = useSelector((state) => state.teachers);
    const loaderData = useLoaderData();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        dispatch(setTeachers({ teachers: loaderData }));
    }, []);

    const handleNewTeacher = () => navigate('new', { replace: true });
    const handleEdit = (id) => navigate(`edit/${id}`, { replace: true });
    const handleDelete = (id) => dispatch(fetchRemove(id));

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <PageHeader title={'TEACHERS'} description={'Manage teachers'} />
            <Button variant="outlined" onClick={handleNewTeacher}>
                ADD TEACHER
            </Button>
            <Grid container spacing={2}>
                {teachers.map((teacher) => (
                    <Grid item key={teacher.id} xs={12} sm={12} lg={6}>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Card teacher={teacher} />
                            <Stack
                                direction="row"
                                justifyContent="right"
                                spacing={1}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() => handleEdit(teacher.id)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDelete(teacher.id)}
                                >
                                    Delete
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export const loader = async () => {
    try {
        const teachers = await TeacherService.getAllTeachers();

        return teachers;
    } catch (error) {
        throw { message: error.message };
    }
};

export default Teachers;
