import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Avatar from '../../../../components/Avatar';
import { drawerWidth } from '../../../../layouts/Admin';
import LessonService from '../../../../services/Lesson';
import TeacherService from '../../../../services/Teacher';
import { fetchStatuses } from '../../../../utils/consts';
import { getFormData } from '../../../../utils/formDataConstructor';
import TransferList from './TransferList';

function EditTeacher() {
    const loaderData = useLoaderData();
    const width = window.innerWidth - drawerWidth;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [img, setImg] = useState(loaderData.teacher.img);
    const [lessons, setLessons] = useState(loaderData.teacher.lessons);
    const [emailStatus, setEmailStatus] = useState(fetchStatuses.IDLE);
    const navigate = useNavigate();

    const onLessonChange = (data) => setLessons(data);

    const handleFirstName = (e) => setFirstName(e.target.value);
    const handleLastName = (e) => setLastName(e.target.value);
    const handleEmail = (e) => {
        setEmailStatus(fetchStatuses.IDLE);
        setEmail(e.target.value);
    };
    const handleImage = (img) => setImg(img);

    const handleSave = async () => {
        const payload = getFormData({
            firstName: firstName || loaderData.teacher.firstName,
            lastName: lastName || loaderData.teacher.lastName,
            email: email || loaderData.teacher.email,
            img: img || loaderData.teacher.img,
            lessons: lessons.map((lesson) => lesson.id),
        });

        try {
            const result = await TeacherService.update(
                loaderData.teacher.id,
                payload
            );

            if (result) {
                navigate('/admin/teachers', { replace: true });
            }
        } catch (e) {
            if (e.message === 'Validation error') {
                setEmailStatus(fetchStatuses.FAILED);
            }

            throw { message: e.message };
        }
    };

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
                        <Stack
                            direction="row"
                            justifyContent={
                                width <= 768 ? 'space-between' : 'right'
                            }
                            alignItems="center"
                            spacing={1}
                        >
                            <Typography variant="caption">
                                First name:{' '}
                            </Typography>
                            <TextField
                                value={firstName}
                                onChange={handleFirstName}
                                label={loaderData.teacher.firstName}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent={
                                width <= 768 ? 'space-between' : 'right'
                            }
                            alignItems="center"
                            spacing={1}
                        >
                            <Typography variant="caption">
                                Last name:{' '}
                            </Typography>
                            <TextField
                                value={lastName}
                                onChange={handleLastName}
                                label={loaderData.teacher.lastName}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent={
                                width <= 768 ? 'space-between' : 'right'
                            }
                            alignItems="center"
                            spacing={1}
                        >
                            <Typography variant="caption">Email:</Typography>
                            <TextField
                                error={
                                    emailStatus.status === fetchStatuses.FAILED
                                }
                                helperText={
                                    emailStatus === fetchStatuses.FAILED
                                        ? 'Invalid email'
                                        : ''
                                }
                                value={email}
                                onChange={handleEmail}
                                label={loaderData.teacher.email}
                            />
                        </Stack>
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
