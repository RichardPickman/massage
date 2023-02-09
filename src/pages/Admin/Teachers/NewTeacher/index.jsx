import { Box, Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Avatar from '../../../../components/Avatar';
import { drawerWidth } from '../../../../layouts/Admin';
import LessonService from '../../../../services/Lesson';
import {
    changeEmail,
    changeFirstName,
    changeImage,
    changeLastName,
    changeLessons,
    clearState,
} from '../../../../store/reducers/teacher';
import { fetchCreate } from '../../../../store/reducers/teacher/fetch';
import { fetchStatuses } from '../../../../utils/consts';
import InputWithLabel from '../components/InputWithLabel';
import TransferList from './TransferList';

function NewTeacher() {
    const { status, ...teacher } = useSelector((state) => state.teacher);
    const dispatch = useDispatch();
    const lessonsData = useLoaderData();
    const width = window.innerWidth - drawerWidth;

    const navigate = useNavigate();

    useLayoutEffect(() => {
        dispatch(clearState());
    }, []);

    useEffect(() => {
        if (status === fetchStatuses.SUCCEEDED) {
            navigate('/admin/teachers', { replace: true });
        }
    }, [status]);

    const onLessonChange = (data) => dispatch(changeLessons(data));
    const handleFirstName = (e) => dispatch(changeFirstName(e.target.value));
    const handleLastName = (e) => dispatch(changeLastName(e.target.value));
    const handleEmail = (e) => dispatch(changeEmail(e.target.value));
    const handleImage = (img) => dispatch(changeImage(img));

    const handleSave = () =>
        dispatch(
            fetchCreate({
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
                    />
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <InputWithLabel
                                caption={'First Name'}
                                value={teacher.firstName}
                                onChange={handleFirstName}
                            />
                            <InputWithLabel
                                caption={'Last name'}
                                value={teacher.lastName}
                                onChange={handleLastName}
                            />
                            <InputWithLabel
                                caption={'Email'}
                                error={status === fetchStatuses.FAILED}
                                helperText={
                                    status === fetchStatuses.FAILED
                                        ? 'Invalid email'
                                        : ''
                                }
                                value={teacher.email}
                                onChange={handleEmail}
                            />
                        </Box>
                    </Box>
                </Box>
                <TransferList
                    lessons={lessonsData}
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

export const loader = async () => {
    try {
        const response = await LessonService.getAllLessons();

        return response;
    } catch (error) {
        throw { message: error.message };
    }
};

export default NewTeacher;
