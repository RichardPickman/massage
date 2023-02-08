import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Avatar from '../../../../components/Avatar';
import LessonService from '../../../../services/Lesson';
import TeacherService from '../../../../services/Teacher';
import { fetchStatuses } from '../../../../utils/consts';
import { getFormData } from '../../../../utils/formDataConstructor';
import TransferList from './TransferList';

function NewTeacher() {
    const lessonsData = useLoaderData();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [img, setImg] = useState('');
    const [lessons, setLessons] = useState([]);
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
            firstName: firstName,
            lastName: lastName,
            email: email,
            img: img,
            lessons: lessons.map((lesson) => lesson.id),
        });

        try {
            const result = await TeacherService.createTeacher(payload);

            navigate('/admin/teachers', { replace: true });
        } catch (e) {
            if (e.message === 'Validation error') {
                setEmailStatus(fetchStatuses.FAILED);
            }

            throw { message: e.message };
        }
    };

    const handleCancel = () => navigate(-1);

    return (
        <Box
            sx={{
                display: 'flex',
                margin: '0 auto',
                flexDirection: 'column',
                width: '80%',
                gap: 2,
                p: 2,
            }}
        >
            <Paper
                variant="outlined"
                sx={{
                    display: 'flex',
                    margin: '0 auto',
                    flexDirection: 'column',
                    background: '#222222',
                    width: '50%',
                    gap: 2,
                    p: 2,
                }}
            >
                <Typography variant="h5">Profile</Typography>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1}
                >
                    <Avatar
                        width={200}
                        height={200}
                        onAvatarChange={handleImage}
                    />
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Stack
                            direction="row"
                            justifyContent="right"
                            alignItems="center"
                            spacing={1}
                        >
                            <Typography variant="caption">
                                First name:{' '}
                            </Typography>
                            <TextField
                                value={firstName}
                                onChange={handleFirstName}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="right"
                            alignItems="center"
                            spacing={1}
                        >
                            <Typography variant="caption">
                                Last name:{' '}
                            </Typography>
                            <TextField
                                value={lastName}
                                onChange={handleLastName}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="right"
                            alignItems="center"
                            spacing={1}
                        >
                            <Typography variant="caption">Email: </Typography>
                            <TextField
                                error={
                                    emailStatus.status === fetchStatuses.FAILED
                                }
                                helperText={
                                    emailStatus.status === fetchStatuses.FAILED
                                        ? 'Invalid email'
                                        : ''
                                }
                                value={email}
                                onChange={handleEmail}
                            />
                        </Stack>
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
