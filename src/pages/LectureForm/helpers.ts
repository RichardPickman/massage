import dayjs from 'dayjs';

export interface StagedImage {
    id: string;
    file: File;
    preview: string;
}

// A stored image: the key is sent back so the server knows what to keep, the
// URL is only for the preview.
export interface ExistingImage {
    key: string;
    url: string;
}

export interface LectureFormValues {
    topic: string;
    teacher: string;
    lesson: string;
    date?: Date;
}

export interface LectureFormResult {
    message: string;
    lectureId: string;
}

interface LectureFormPayload extends Omit<LectureFormValues, 'date'> {
    date: string;
    images: StagedImage[];
    keepImages?: string[];
}

export const getForm = ({
    topic,
    teacher,
    lesson,
    date,
    images,
    keepImages,
}: LectureFormPayload) => {
    const lecture = new FormData();

    lecture.append('topic', topic);

    if (date) {
        lecture.append('date', dayjs(date).format('MM/DD/YYYY'));
    }

    if (teacher) {
        lecture.append('teacher', teacher);
    }

    if (lesson) {
        lecture.append('lesson', lesson);
    }

    // Only the edit form sends this: an empty array means every stored image
    // was removed.
    if (keepImages) {
        lecture.append('keepImages', JSON.stringify(keepImages));
    }

    for (const image of images) {
        lecture.append('images', image.file);
    }

    return lecture;
};
