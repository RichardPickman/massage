import dayjs from 'dayjs';

export interface StagedImage {
    id: string;
    file: File;
    preview: string;
}

interface LectureFormValues {
    topic: string;
    teacher: string;
    lesson: string;
    date: string;
    images: StagedImage[];
}

export const getForm = ({
    topic,
    teacher,
    lesson,
    date,
    images,
}: LectureFormValues) => {
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

    for (const image of images) {
        lecture.append('images', image.file);
    }

    return lecture;
};
