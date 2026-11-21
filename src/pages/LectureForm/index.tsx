import { nanoid } from '@reduxjs/toolkit';
import { FloppyDiskIcon, ImageIcon, TrashIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { type ChangeEvent, useState } from 'react';
import { AlertWithLink } from '../../components/AlertWithLink';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
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
    backLabel?: string;
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
    backLabel = 'All lectures',
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
    // A pristine form is not invalid: the messages appear after the first save
    // attempt, and go away as soon as the field is edited.
    const [attempted, setAttempted] = useState(false);

    const hasImages = images.length + existingImages.length > 0;
    const topicProblem = attempted && topic.trim().length === 0;
    const imagesProblem = attempted && !hasImages;

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
        setAttempted(false);
    };

    // Clearing is an author action, so it also drops the message about the
    // previous attempt - a successful save keeps its banner.
    const clearForm = () => {
        resetForm();
        setAlert(null);
    };

    const submitForm = async () => {
        setAttempted(true);

        if (!topic.trim() || !hasImages) {
            setAlert({
                status: alertStatuses.FAIL,
                text: 'Check the highlighted fields before saving.',
            });

            // The banner is off-screen on a phone and the reason lives next to
            // the field, so bring the first problem into view.
            window.requestAnimationFrame(() => {
                const target = !topic.trim()
                    ? document.getElementById('lecture-topic')
                    : document.getElementById('lecture-upload');

                target?.scrollIntoView?.({ block: 'center' });
                target?.focus?.();
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
        <div className="flex flex-1 flex-col gap-6">
            <PageHeader
                back={backTo ? { to: backTo, label: backLabel } : undefined}
                title={title}
                description="Topic and at least one image are required."
            />

            {alert ? (
                <AlertWithLink
                    status={alert.status}
                    text={alert.text}
                    path={alert.path}
                    title={alert.title}
                    onClose={() => setAlert(null)}
                />
            ) : null}

            <div className="flex w-full max-w-2xl flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="lecture-topic">Topic</Label>
                        <Input
                            id="lecture-topic"
                            value={topic}
                            aria-invalid={topicProblem}
                            aria-describedby={
                                topicProblem ? 'lecture-topic-error' : undefined
                            }
                            onChange={(event) => setTopic(event.target.value)}
                        />
                        {topicProblem ? (
                            <p
                                id="lecture-topic-error"
                                className="text-xs text-destructive"
                            >
                                Topic cannot be empty
                            </p>
                        ) : null}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="lecture-teacher">Teacher</Label>
                            <Input
                                id="lecture-teacher"
                                placeholder="Optional"
                                value={teacher}
                                onChange={(event) =>
                                    setTeacher(event.target.value)
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="lecture-lesson">Lesson</Label>
                            <Input
                                id="lecture-lesson"
                                placeholder="Optional"
                                value={lesson}
                                onChange={(event) =>
                                    setLesson(event.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="lecture-date">Lecture day</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="lecture-date"
                                    variant="outline"
                                    className="w-full justify-start text-base font-normal tracking-normal normal-case md:text-sm"
                                >
                                    {date
                                        ? dayjs(date).format('MM/DD/YYYY')
                                        : 'Pick a lecture day'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                align="start"
                                className="w-auto p-0"
                            >
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <p className="text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase">
                        Images
                    </p>
                    {/* The obvious next action gets the width, not a place in a row
                    of buttons. A real button, so the error below can put focus
                    on it. */}
                    <Button
                        id="lecture-upload"
                        variant="outline"
                        className="min-h-12 w-full border-dashed"
                        aria-describedby={
                            imagesProblem ? 'lecture-images-error' : undefined
                        }
                        onClick={() =>
                            document.getElementById('lecture-images')?.click()
                        }
                    >
                        <ImageIcon />
                        Upload images
                    </Button>
                    <Input
                        id="lecture-images"
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleImageUpload}
                    />
                    {imagesProblem ? (
                        <p
                            id="lecture-images-error"
                            className="text-xs text-destructive"
                        >
                            Attach at least one image
                        </p>
                    ) : null}
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

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                        variant={initialImages ? 'outline' : 'destructive'}
                        disabled={isSaving}
                        onClick={clearForm}
                    >
                        <TrashIcon />
                        {resetLabel}
                    </Button>
                    <Button disabled={isSaving} onClick={submitForm}>
                        <FloppyDiskIcon />
                        {isSaving ? 'Saving...' : submitLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};
