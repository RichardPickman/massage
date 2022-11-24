import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    IconButton,
    Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { useState, useContext } from 'react';
import Alert from '../../components/Alert';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { getForm, handleImages } from './helpers';
import {} from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LoadingContext } from '../../context/loading';
import LectureService from '../../services/Lecture';

function AddLecture() {
    const dumbDB = {
        teachers: ['Monika Kosji', 'Kamil'],
        lessons: ['Massage theory', 'BHP'],
    };
    const [teacher, setTeachers] = useState('');
    const [lesson, setLesson] = useState('');
    const [images, setImages] = useState([]);
    const [topic, setTopic] = useState('');
    const [date, setDate] = useState(null);

    const [alert, setAlert] = useState({ status: 'onhold', message: '' });
    const [id, setId] = useState(null);

    const loading = useContext(LoadingContext);

    const submitForm = async (e) => {
        e.preventDefault();

        loading.toggleLoading(true);

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
        } finally {
            loading.toggleLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            {alert.status !== 'onhold' && (
                <Alert
                    text={alert.message}
                    status={alert.status}
                    onClose={() => setAlert({ status: 'onhold' })}
                    path={`/lectures/${id}`}
                />
            )}
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
                <TextField
                    label="Topic"
                    error={topic.length === 0}
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
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
                        onChange={(event) => setTeachers(event.target.value)}
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
                        onChange={(event) => setLesson(event.target.value)}
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
                        onChange={(event) =>
                            setImages(handleImages(event.target.files, images))
                        }
                    />
                </Button>
                <Box display="flex" flexWrap="wrap" gap={1} margin={1}>
                    {images.map((img, index) => (
                        <Box position="relative" key={index}>
                            <IconButton
                                onClick={() =>
                                    setImages((prev) =>
                                        prev.filter((img, i) => i !== index)
                                    )
                                }
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
