import {
    Box,
    MenuItem,
    TextField,
    Button,
    Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getForm } from './helpers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import React, { useState } from 'react';
import Alert from '../../components/AlertWithLink';

import TeacherService from '../../services/Teacher';
import LessonService from '../../services/Lesson';
import LectureService from '../../services/Lecture';
import { useLoaderData } from 'react-router-dom';
import { ImageList } from './elements/ImageList';
import { nanoid } from '@reduxjs/toolkit';
import { FormControl } from './elements/FormControl';

function AddLecture() {
    const loaderData = useLoaderData();
    const [teacher, setTeachers] = useState('');
    const [lesson, setLesson] = useState('');
    const [images, setImages] = useState([]);
    const [topic, setTopic] = useState('');
    const [date, setDate] = useState(null);
    const [alert, setAlert] = useState({ status: 'onhold', message: '' });
    const [id, setId] = useState(null);

    const submitForm = async (e) => {
        const lecture = getForm(topic, teacher, date, lesson, images);
        
        try {
            const response = await LectureService.createLecture(lecture);

            setAlert({
                status: 'successful',
                message: 'Lecture added successfully',
            });
            setId(response.payload._id);
        } catch (e) {
            setAlert({ status: 'error' });
        }
    };

    const handleImageUpload = (e) => {
        const arr = Array.from(e.target.files);

        const result = arr.map((img) => ({ id: nanoid(), file: img }));

        setImages((prev) => [...prev, ...result]);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" flexDirection="column" gap={2}>
                {alert.status !== 'onhold' && (
                    <Alert
                        text={alert.messageWithLink}
                        status={alert.status}
                        onClose={() => setAlert({ status: 'onhold' })}
                        path={`/lectures/${id}`}
                    />
                )}
                <TextField
                    label="Topic"
                    error={topic.length === 0}
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    helperText={
                        topic.length === 0 ? 'Topic cannot be empty' : ''
                    }
                />
                <FormControl value={teacher} label="Teacher" onClick={(e) => setTeachers(e.target.value)}>
                    {loaderData.teachers.map((teacher) => (
                        <MenuItem value={teacher.id} key={teacher.id}>
                            {[teacher.firstName, teacher.lastName].join(
                                ' '
                            )}
                        </MenuItem>
                    ))}
                </FormControl>
                <FormControl value={lesson} label="Lesson" onClick={(event) => setLesson(event.target.value)}>
                    {loaderData.lessons.map((lesson) => (
                        <MenuItem value={lesson.id} key={lesson.id}>
                            {lesson.title}
                        </MenuItem>
                    ))}
                </FormControl>
                <DatePicker
                    label="Lecture day"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                />
                <Button variant="outlined" component="label">
                    Upload File
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        hidden
                        multiple
                        onChange={handleImageUpload}
                    />
                </Button>
                <ImageList images={images} setImages={setImages} />
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        onClick={submitForm}
                        color="success"
                        fullWidth
                    >
                        Save
                    </Button>
                    <Button variant="outlined" color="error" fullWidth>
                        Delete
                    </Button>
                </Stack>
            </Box>
        </LocalizationProvider>
    );
}

export const loader = async () => {
    try {
        const teachers = await TeacherService.getAllTeachers();
        const lessons = await LessonService.getAllLessons();

        return { teachers, lessons };
    } catch (error) {
        throw { message: error.message };
    }
};

export default AddLecture;
