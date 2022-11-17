import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    IconButton,
    CircularProgress,
    Stack,
    Backdrop,
    Alert,
    Link,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { createLecture } from '../../../http/lectures';
import { getForm, handleImages } from './helpers';
import {} from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LoadingContext } from '../../../context/loading';

function AddLecture() {
    const dumbDB = {
        teachers: ['Monika Kosji', 'Kamil'],
        lessons: ['Massage theory', 'BHP'],
    };
    const [teacher, setTechers] = useState('');
    const [lesson, setLesson] = useState('');
    const [images, setImages] = useState([]);
    const [topic, setTopic] = useState('');
    const [date, setDate] = useState(null);

    const [alert, setAlert] = useState({ status: 'onhold' });
    const [id, setId] = useState(null);

    const loading = useContext(LoadingContext);

    const handleTeacherChange = (event) => setTechers(event.target.value);
    const handleLessonChange = (event) => setLesson(event.target.value);
    const handleTopicChange = (event) => setTopic(event.target.value);

    const handleImage = (event) =>
        setImages(handleImages(event.target.files, images));

    const submitForm = async (e) => {
        e.preventDefault();

        loading.toggleLoading(true);

        const lecture = getForm(topic, teacher, date, lesson, images);

        const response = await createLecture(lecture);

        if (response.status === 200) {
            setAlert({ status: 'successful' });
            setId(response.data.payload._id);
            loading.toggleLoading(false);
        } else {
            setAlert({ status: 'error' });
            loading.toggleLoading(false);
        }
    };

    const removeImage = (index) =>
        setImages((prev) => prev.filter((img, i) => i !== index));

    const AlertComponent = () =>
        alert.status === 'successful' ? (
            <Alert
                severity="success"
                action={
                    <Button size="small">
                        <Link
                            underline="none"
                            to={`/lectures/${id}`}
                            component={RouterLink}
                        >
                            Lecture
                        </Link>
                    </Button>
                }
            >
                Lecture successfully added. You may add another lecture
            </Alert>
        ) : (
            <Alert
                severity="error"
                onClose={() => setAlert({ status: 'onhold' })}
            >
                Something went wrong
            </Alert>
        );

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box
                component="form"
                action="/lectures"
                method="POST"
                encType="multipart/form-data"
                onSubmit={submitForm}
                display="flex"
                flexDirection="column"
                gap={2}
            >
                {alert.status !== 'onhold' && <AlertComponent />}
                <TextField
                    label="Topic"
                    error={topic.length === 0}
                    value={topic}
                    onChange={handleTopicChange}
                    helperText={
                        topic.length === 0 ? 'Topic cannot be empty' : ''
                    }
                />
                <FormControl fullWidth>
                    <InputLabel id="teacher-label">Teacher</InputLabel>
                    <Select
                        labelId="teacher-label"
                        value={teacher}
                        label="Teacher"
                        onChange={handleTeacherChange}
                    >
                        {dumbDB.teachers.map((name) => (
                            <MenuItem value={name} key={name}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="lesson-label">Lesson</InputLabel>
                    <Select
                        labelId="lesson-label"
                        value={lesson}
                        label="Lesson"
                        onChange={handleLessonChange}
                    >
                        {dumbDB.lessons.map((lessonName) => (
                            <MenuItem value={lessonName} key={lessonName}>
                                {lessonName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <DatePicker
                    label="Lecture day"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                />
                <Button variant="contained" component="label">
                    Upload File
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        hidden
                        multiple
                        onChange={handleImage}
                    />
                </Button>
                <Box display="flex" flexWrap="wrap" gap={1} margin={1}>
                    {images.map((img, index) => (
                        <Box position="relative" key={index}>
                            <IconButton
                                onClick={() => removeImage(index)}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                }}
                            >
                                <DeleteOutlineOutlinedIcon color="error" />
                            </IconButton>
                            <Box
                                component="img"
                                sx={{
                                    width: 200,
                                    height: 150,
                                    objectFit: 'contain',
                                }}
                                src={window.URL.createObjectURL(img)}
                            />
                        </Box>
                    ))}
                </Box>
                <Stack direction="column" spacing={2}>
                    <Button variant="contained" color="success" type="submit">
                        Save
                    </Button>
                    <Button variant="contained" color="error">
                        Delete
                    </Button>
                </Stack>
            </Box>
        </LocalizationProvider>
    );
}

export default AddLecture;
