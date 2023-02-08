import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Stack,
    Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getForm, putFilesToArray } from './helpers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import React, { useCallback, useState } from 'react';
import Alert from '../../components/Alert';

import LectureService from '../../services/Lecture';
import ImageCard from '../../components/ImageCard';
import update from 'immutability-helper';
import { useAutoAnimate } from '@formkit/auto-animate/react';

function AddLecture() {
    const dumbDB = {
        teachers: ['Monika Kosji', 'Kamil'],
        lessons: ['Zasady masażu', 'BHP', 'Anatomia', 'Fizioterapia'],
    };
    const [teacher, setTeachers] = useState('');
    const [lesson, setLesson] = useState('');
    const [images, setImages] = useState([]);
    const [topic, setTopic] = useState('');
    const [date, setDate] = useState(null);
    const [alert, setAlert] = useState({ status: 'onhold', message: '' });
    const [id, setId] = useState(null);

    const [listRef] = useAutoAnimate();

    const moveImage = useCallback((dragIndex, hoverIndex) => {
        setImages((prevImages) =>
            update(prevImages, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevImages[dragIndex]],
                ],
            })
        );
    }, []);

    const submitForm = async (e) => {
        e.preventDefault();

        const lecture = getForm(topic, teacher, date, lesson, images.reverse());

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

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box display="flex" flexDirection="column" gap={2}>
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
                            onChange={(event) =>
                                setTeachers(event.target.value)
                            }
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
                    <Button variant="outlined" component="label">
                        Upload File
                        <input
                            type="file"
                            name="images"
                            accept="image/*"
                            hidden
                            multiple
                            onChange={(event) =>
                                setImages(
                                    putFilesToArray(event.target.files, images)
                                )
                            }
                        />
                    </Button>
                    <Grid
                        container
                        justifyContent="left"
                        spacing={2}
                        ref={listRef}
                    >
                        {images.map((img, index) => (
                            <Grid item key={img.name} xs={6} sm={4} md={3}>
                                <ImageCard
                                    remove={() =>
                                        setImages((prev) =>
                                            prev.filter((img, i) => i !== index)
                                        )
                                    }
                                    img={window.URL.createObjectURL(img)}
                                    text={img.name}
                                    index={index}
                                    moveImage={moveImage}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            color="success"
                            type="submit"
                            fullWidth
                        >
                            Save
                        </Button>
                        <Button variant="outlined" color="error" fullWidth>
                            Delete
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </LocalizationProvider>
    );
}

export default AddLecture;
