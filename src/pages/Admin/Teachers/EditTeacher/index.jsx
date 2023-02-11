import { Box, Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Avatar from '../../../../components/Avatar';
import { drawerWidth } from '../../../../layouts/Admin';
import LessonService from '../../../../services/Lesson';
import TeacherService from '../../../../services/Teacher';
import {
    changeEmail,
    changeFirstName,
    changeImage,
    changeLastName,
    changeLessons,
    setEditTeacher,
} from '../../../../store/reducers/teacher';
import { fetchUpdate } from '../../../../store/reducers/teacher/fetch';
import { fetchStatuses } from '../../../../utils/consts';
import InputWithLabel from '../components/InputWithLabel';
import TransferList from './TransferList';

function EditTeacher() {
    const { status, ...teacher } = useSelector((state) => state.teacher);
    const dispatch = useDispatch();
    const loaderData = useLoaderData();
    const width = window.innerWidth - drawerWidth;

    useLayoutEffect(() => {
        dispatch(setEditTeacher(loaderData.teacher));
    }, []);

    useEffect(() => {
        if (status === fetchStatuses.SUCCEEDED) {
            navigate('/admin/teachers', { replace: true });
        }
    }, [status]);

    const navigate = useNavigate();

    const onLessonChange = (data) => dispatch(changeLessons(data));
    const handleFirstName = (e) => dispatch(changeFirstName(e.target.value));
    const handleLastName = (e) => dispatch(changeLastName(e.target.value));
    const handleEmail = (e) => dispatch(changeEmail(e.target.value));
    const handleImage = (img) => dispatch(changeImage(img));

    const handleSave = () =>
        dispatch(
            fetchUpdate({
                id: loaderData.teacher.id,
                ...teacher,
            })
        );

    const handleCancel = () => navigate(-1);

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Paper
                variant="outlined"
                sx={{
                    display: 'flex',
                    margin: '0 auto',
                    flexDirection: 'column',
                    gap: 2,
                    p: 2,
                }}
            >
                <Typography variant="h5">Profile</Typography>
                <Box
                    display="flex"
                    flexDirection={width <= 768 ? 'column' : 'row'}
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                >
                    <Avatar
                        width={200}
                        height={200}
                        onAvatarChange={handleImage}
                        predefinedAvatar={loaderData.teacher.img}
                    />
                    <Box display="flex" flexDirection="column" gap={1}>
                        <InputWithLabel
                            value={teacher.firstName}
                            onChange={handleFirstName}
                            label={loaderData.teacher.firstName}
                        />
                        <InputWithLabel
                            value={teacher.lastName}
                            onChange={handleLastName}
                            label={loaderData.teacher.lastName}
                        />
                        <InputWithLabel
                            error={status === fetchStatuses.FAILED}
                            helperText={
                                status === fetchStatuses.FAILED
                                    ? 'Invalid email'
                                    : ''
                            }
                            value={teacher.email}
                            onChange={handleEmail}
                            label={loaderData.teacher.email}
                        />
                    </Box>
                </Box>
                <TransferList
                    predefinedRight={loaderData.lessons}
                    predefinedLeft={loaderData.teacher.lessons}
                    onLessonChange={onLessonChange}
                />
                <Box display="flex" gap={2} width="100%" justifyContent="right">
                    <Button variant="outlined" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export const loader = async ({ params }) => {
    try {
        const { id } = params;
        const teacher = await TeacherService.get(id);
        const lessons = await LessonService.getAllLessons();

        const filteredExisted = teacher.lessons.map((lesson) => lesson.id);

        return {
            teacher,
            lessons: lessons.filter(
                (lesson) => !filteredExisted.includes(lesson.id)
            ),
        };
    } catch (error) {
        throw { message: error.message };
    }
};

export default EditTeacher;
