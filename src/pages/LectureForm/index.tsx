import { nanoid } from '@reduxjs/toolkit';
import { FloppyDiskIcon, ImageIcon, TrashIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
                text: t('lectures.form.checkFields'),
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
                title: t('lectures.openLecture'),
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
                description={t('lectures.form.required')}
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

            {/* Two blocks that both fill their side: the details on the left,
                the uploader and its thumbnails on the right, stacked below lg
                where a half-width column would be too cramped to type in. */}
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="lecture-topic">
                            {t('lectures.form.topic')}
                        </Label>
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
                                {t('lectures.form.topicRequired')}
                            </p>
                        ) : null}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="lecture-teacher">
                                {t('lectures.form.teacher')}
                            </Label>
                            <Input
                                id="lecture-teacher"
                                placeholder={t('lectures.form.optional')}
                                value={teacher}
                                onChange={(event) =>
                                    setTeacher(event.target.value)
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="lecture-lesson">
                                {t('lectures.form.lesson')}
                            </Label>
                            <Input
                                id="lecture-lesson"
                                placeholder={t('lectures.form.optional')}
                                value={lesson}
                                onChange={(event) =>
                                    setLesson(event.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="lecture-date">
                            {t('lectures.form.date')}
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="lecture-date"
                                    variant="outline"
                                    className="w-full justify-start text-base font-normal tracking-normal normal-case md:text-sm"
                                >
                                    {date
                                        ? dayjs(date).format('L')
                                        : t('lectures.form.pickDay')}
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
                        {t('lectures.form.images')}
                    </p>
                    {/* The obvious next action gets the width, not a place in a row
                    of buttons. A real button, so the error below can put focus
                    on it. */}
                    <Button
                        id="lecture-upload"
                        variant="outline"
                        className="min-h-44 w-full flex-col gap-2 border-dashed py-6"
                        aria-describedby={
                            imagesProblem ? 'lecture-images-error' : undefined
                        }
                        onClick={() =>
                            document.getElementById('lecture-images')?.click()
                        }
                    >
                        <ImageIcon className="size-6" />
                        {t('lectures.form.upload')}
                        <span className="text-xs font-normal tracking-normal normal-case">
                            {t('lectures.form.uploadHint')}
                        </span>
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
                            {t('lectures.form.imagesRequired')}
                        </p>
                    ) : null}
                    <ExistingImageList
                        images={existingImages}
                        remove={removeExistingImage}
                    />
                    <ImageList images={images} setImages={setImages} />
                    {initialImages ? (
                        <p className="text-xs text-muted-foreground">
                            {t('lectures.form.savedNote')}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
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
    );
};
