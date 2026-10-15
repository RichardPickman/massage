import React, { useLayoutEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import TeacherService from '../../../../services/Teacher';
import { setTeachers } from '../../../../store/reducers/teachers';
import { fetchRemove } from '../../../../store/reducers/teachers/fetch';
import PageHeader from '../../helpers/PageHeader';
import ShowCard from './showCard';

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
        <Card
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
                        <Card flex>
                            <ShowCard teacher={teacher} />
                            <Stack direction="row" justifyContent="right">
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
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Card>
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
