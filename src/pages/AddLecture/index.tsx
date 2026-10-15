import { nanoid } from '@reduxjs/toolkit';
import { FloppyDiskIcon, ImageIcon, TrashIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { type ChangeEvent, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AlertWithLink } from '../../components/AlertWithLink';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../../components/ui/popover';
import LectureService from '../../services/Lecture';
import LessonService from '../../services/Lesson';
import TeacherService from '../../services/Teacher';
import { getErrorMessage } from '../../services/errors';
import type { Lesson, Teacher } from '../../services/models';
import { alertStatuses, type AlertStatus } from '../../utils/consts';
import { FormControl } from './elements/FormControl';
import { ImageList } from './elements/ImageList';
import { getForm, type StagedImage } from './helpers';

interface LectureLoaderData {
    teachers: Teacher[];
    lessons: Lesson[];
}

interface LectureAlert {
    status: AlertStatus;
    text: string;
    path?: string;
    title?: string;
}

const getFullName = (teacher: Teacher) =>
    [teacher.firstName, teacher.lastName].filter(Boolean).join(' ');

const getOptions = (teachers: Teacher[], lessons: Lesson[]) => ({
    teacherOptions: teachers.map((item) => ({
        value: item._id,
        label: getFullName(item),
    })),
    lessonOptions: lessons.map((item) => ({
        value: item._id,
        label: item.title,
    })),
});

export const AddLecture = () => {
    const loaderData = useLoaderData() as LectureLoaderData;

    const [topic, setTopic] = useState('');
    const [teacher, setTeacher] = useState('');
    const [lesson, setLesson] = useState('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [images, setImages] = useState<StagedImage[]>([]);
    const [alert, setAlert] = useState<LectureAlert | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const { teacherOptions, lessonOptions } = getOptions(
        loaderData.teachers,
        loaderData.lessons
    );

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);

        const stagedImages = files.map((file) => ({
            id: nanoid(),
            file,
            preview: window.URL.createObjectURL(file),
        }));

        setImages((prevImages) => [...prevImages, ...stagedImages]);
        event.target.value = '';
    };

    const resetForm = () => {
        images.forEach((image) => window.URL.revokeObjectURL(image.preview));

        setTopic('');
        setTeacher('');
        setLesson('');
        setDate(undefined);
        setImages([]);
    };

    const submitForm = async () => {
        if (!topic.trim()) {
            setAlert({
                status: alertStatuses.FAIL,
                text: 'Topic cannot be empty',
            });

            return;
        }

        // The API iterates the uploaded files, so an image is required.
        if (images.length === 0) {
            setAlert({
                status: alertStatuses.FAIL,
                text: 'Attach at least one image',
            });

            return;
        }

        setIsSaving(true);

        try {
            const response = await LectureService.createLecture(
                getForm({
                    topic: topic.trim(),
                    teacher,
                    lesson,
                    date: date ? date.toISOString() : '',
                    images,
                })
            );

            setAlert({
                status: alertStatuses.SUCCESS,
                text: response.message,
                path: `/lectures/${response.payload._id}`,
                title: 'Open lecture',
            });
            resetForm();
        } catch (error) {
            setAlert({
                status: alertStatuses.FAIL,
                text: getErrorMessage(error),
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add lecture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {alert ? (
                    <AlertWithLink
                        status={alert.status}
                        text={alert.text}
                        path={alert.path}
                        title={alert.title}
                        onClose={() => setAlert(null)}
                    />
                ) : null}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="lecture-topic">Topic</Label>
                    <Input
                        id="lecture-topic"
                        value={topic}
                        aria-invalid={topic.length === 0}
                        onChange={(event) => setTopic(event.target.value)}
                    />
                    {topic.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                            Topic cannot be empty
                        </p>
                    ) : null}
                </div>
                <FormControl
                    label="Teacher"
                    value={teacher}
                    options={teacherOptions}
                    onChange={setTeacher}
                    emptyHint={
                        teacherOptions.length === 0
                            ? 'No teachers available - type a teacher id or name'
                            : undefined
                    }
                />
                <FormControl
                    label="Lesson"
                    value={lesson}
                    options={lessonOptions}
                    onChange={setLesson}
                    emptyHint={
                        lessonOptions.length === 0
                            ? 'No lessons available - type a lesson id or title'
                            : undefined
                    }
                />
                <div className="flex flex-col gap-1">
                    <Label>Lecture day</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="justify-start font-normal"
                            >
                                {date
                                    ? dayjs(date).format('MM/DD/YYYY')
                                    : 'Pick a lecture day'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Images</Label>
                    <Button asChild variant="outline" className="self-start">
                        <label htmlFor="lecture-images">
                            <ImageIcon />
                            Upload images
                        </label>
                    </Button>
                    <Input
                        id="lecture-images"
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleImageUpload}
                    />
                    <ImageList images={images} setImages={setImages} />
                </div>
                <div className="flex gap-2">
                    <Button
                        className="flex-1"
                        disabled={isSaving}
                        onClick={submitForm}
                    >
                        <FloppyDiskIcon />
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={resetForm}
                    >
                        <TrashIcon />
                        Clear
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

// The API exposes no teachers or lessons endpoint yet, so a missing collection
// must not stop the page from rendering: the fields fall back to free text
// instead of failing the whole loader.
export const loader = async () => {
    const [teachers, lessons] = await Promise.all([
        TeacherService.getAllTeachers().catch(() => [] as Teacher[]),
        LessonService.getAllLessons().catch(() => [] as Lesson[]),
    ]);

    return { teachers, lessons };
};
