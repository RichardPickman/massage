import { nanoid } from '@reduxjs/toolkit';
import { FloppyDiskIcon, ImageIcon, TrashIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { type ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { getErrorMessage } from '../../services/errors';
import { alertStatuses, type AlertStatus } from '../../utils/consts';
import { ExistingImageList } from './elements/ExistingImageList';
import { ImageList } from './elements/ImageList';
import {
    getForm,
    type ExistingImage,
    type LectureFormResult,
    type LectureFormValues,
    type StagedImage,
} from './helpers';

interface LectureAlert {
    status: AlertStatus;
    text: string;
    path?: string;
    title?: string;
}

interface LectureFormProps {
    title: string;
    submitLabel: string;
    initialValues: LectureFormValues;
    // Provided by the edit page; its presence switches the form to edit mode.
    initialImages?: ExistingImage[];
    backTo?: string;
    resetLabel?: string;
    onSubmit: (form: FormData) => Promise<LectureFormResult>;
    onSuccess?: (lectureId: string) => void;
}

export const LectureForm = ({
    title,
    submitLabel,
    initialValues,
    initialImages,
    backTo,
    resetLabel = 'Clear',
    onSubmit,
    onSuccess,
}: LectureFormProps) => {
    const [topic, setTopic] = useState(initialValues.topic);
    const [teacher, setTeacher] = useState(initialValues.teacher);
    const [lesson, setLesson] = useState(initialValues.lesson);
    const [date, setDate] = useState<Date | undefined>(initialValues.date);
    const [images, setImages] = useState<StagedImage[]>([]);
    const [existingImages, setExistingImages] = useState<ExistingImage[]>(
        initialImages ?? []
    );
    const [alert, setAlert] = useState<LectureAlert | null>(null);
    const [isSaving, setIsSaving] = useState(false);

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

    const removeExistingImage = (key: string) =>
        setExistingImages((prevImages) =>
            prevImages.filter((image) => image.key !== key)
        );

    const resetForm = () => {
        images.forEach((image) => window.URL.revokeObjectURL(image.preview));

        setTopic(initialValues.topic);
        setTeacher(initialValues.teacher);
        setLesson(initialValues.lesson);
        setDate(initialValues.date);
        setImages([]);
        setExistingImages(initialImages ?? []);
    };

    const submitForm = async () => {
        if (!topic.trim()) {
            setAlert({
                status: alertStatuses.FAIL,
                text: 'Topic cannot be empty',
            });

            return;
        }

        // The API iterates the uploaded files, so an image is required. On the
        // edit form a kept image counts as well.
        if (images.length + existingImages.length === 0) {
            setAlert({
                status: alertStatuses.FAIL,
                text: 'Attach at least one image',
            });

            return;
        }

        setIsSaving(true);
        setAlert(null);

        try {
            const result = await onSubmit(
                getForm({
                    topic: topic.trim(),
                    teacher,
                    lesson,
                    date: date ? date.toISOString() : '',
                    images,
                    keepImages: initialImages
                        ? existingImages.map((image) => image.key)
                        : undefined,
                })
            );

            if (onSuccess) {
                onSuccess(result.lectureId);

                return;
            }

            setAlert({
                status: alertStatuses.SUCCESS,
                text: result.message,
                path: `/lectures/${result.lectureId}`,
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
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <CardTitle>{title}</CardTitle>
                {backTo ? (
                    <Button asChild size="sm" variant="ghost">
                        <Link to={backTo}>Cancel</Link>
                    </Button>
                ) : null}
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
                <div className="flex flex-col gap-1">
                    <Label htmlFor="lecture-teacher">Teacher</Label>
                    <Input
                        id="lecture-teacher"
                        placeholder="Optional"
                        value={teacher}
                        onChange={(event) => setTeacher(event.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="lecture-lesson">Lesson</Label>
                    <Input
                        id="lecture-lesson"
                        placeholder="Optional"
                        value={lesson}
                        onChange={(event) => setLesson(event.target.value)}
                    />
                </div>
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
                    <ExistingImageList
                        images={existingImages}
                        remove={removeExistingImage}
                    />
                    <ImageList images={images} setImages={setImages} />
                    {initialImages ? (
                        <p className="text-xs text-muted-foreground">
                            Removed saved images are deleted when you save.
                        </p>
                    ) : null}
                </div>
                <div className="flex gap-2">
                    <Button
                        className="flex-1"
                        disabled={isSaving}
                        onClick={submitForm}
                    >
                        <FloppyDiskIcon />
                        {isSaving ? 'Saving...' : submitLabel}
                    </Button>
                    <Button
                        variant={initialImages ? 'outline' : 'destructive'}
                        className="flex-1"
                        disabled={isSaving}
                        onClick={resetForm}
                    >
                        <TrashIcon />
                        {resetLabel}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
