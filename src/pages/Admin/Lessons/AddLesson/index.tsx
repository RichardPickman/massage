import { nanoid } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { useLoaderData, useNavigate } from 'react-router-dom';
import CustomLink from '../../../../components/Link';
import TransferList from '../../../../components/TransferList';
import { drawerWidth } from '../../../../layouts/Admin';
import LessonService from '../../../../services/Lesson';
import TeacherService from '../../../../services/Teacher';
import Time from './components/Time';

const weekDays = [
    {
        id: nanoid(),
        title: 'Friday',
    },
    {
        id: nanoid(),
        title: 'Saturday',
    },
    {
        id: nanoid(),
        title: 'Sunday',
    },
];

function AddLesson() {
    const loaderData = useLoaderData();
    const contentWidth = window.innerWidth - drawerWidth;
    const navigate = useNavigate();
    const [lessonStart, setLessonStart] = useState(dayjs('2023-02-4T00:00:00'));
    const [lessonEnd, setLessonEnd] = useState(dayjs('2023-02-4T00:00:00'));
    const [teacher, setTeacher] = useState('');
    const [title, setTitle] = useState('');
    const [room, setRoom] = useState('');
    const [days, setDays] = useState([]);

    const handleTeacherChange = (e) => setTeacher(e.target.value);
    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleRoomChange = (e) => setRoom(e.target.value);
    const onDayChange = (data) => setDays(data);
    const handleSave = async () => {
        try {
            const payload = {
                title: title,
                time: `${dayjs(lessonStart).format('HH:mm')}-${dayjs(
                    lessonEnd
                ).format('HH:mm')}`,
                room: room,
                teacher: teacher,
                days: days.map((day) => day.title),
            };

            const newLesson = await LessonService.createLesson(payload);

            if (newLesson) {
                return navigate('..', { replace: true });
            }
        } catch (error) {
            console.log(error);

            throw { message: error.message };
        }
    };

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: contentWidth <= 768 ? '100%' : '50%',
                alignSelf: 'center',
                justifySelf: 'center',
                m: 2,
                gap: 1,
            }}
        >
            <Paper
                variant="outlined"
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}
            >
                <Stack alignItems="center">
                    <p>Lesson:</p>
                    <TextField
                        fullWidth
                        label="Title"
                        onChange={handleTitleChange}
                    />
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Stack alignItems="center">
                        <p sx={{ flexGrow: 1 }}>Starts on:</p>
                        <Time value={lessonStart} onChange={setLessonStart} />
                    </Stack>
                    <Stack alignItems="center">
                        <p sx={{ flexGrow: 1 }}>Ends on:</p>
                        <Time value={lessonEnd} onChange={setLessonEnd} />
                    </Stack>
                </Stack>
                <Stack alignItems="center">
                    <p sx={{ flexGrow: 1 }}>Room:</p>
                    <TextField
                        fullWidth
                        label="Room"
                        type="number"
                        onChange={handleRoomChange}
                    />
                </Stack>
                <Stack alignItems="center">
                    <p sx={{ flexGrow: 1 }}>Teacher:</p>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Teacher
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Teacher"
                            value={teacher}
                            onChange={handleTeacherChange}
                        >
                            {loaderData.map((teacher) => (
                                <MenuItem
                                    value={teacher.id}
                                    key={teacher.id}
                                >{`${teacher.firstName} ${teacher.lastName}`}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                <TransferList
                    predefinedRight={weekDays}
                    onDataChange={onDayChange}
                />
            </Paper>
            <Card alignSelf="end">
                <Button variant="outlined" onClick={handleSave}>
                    Save
                </Button>
                <CustomLink to="..">
                    <Button variant="outlined">Cancel</Button>
                </CustomLink>
            </Card>
        </Card>
    );
}

export const loader = async () => {
    const teachers = await TeacherService.getAllTeachers();

    return teachers;
};

export default AddLesson;
