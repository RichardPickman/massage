import type { Lecture } from '../../services/models';
import dayjs from '../../i18n/dayjs';

export interface LectureRow {
    id: string;
    topic: string;
    lesson: string;
    teacher: string;
    date: string;
    author?: string;
}

// The API stores the day as MM/DD/YYYY (and the form keeps submitting it that
// way); only the way it is shown follows the interface language.
export const formatLectureDate = (value: string) => {
    const parsed = dayjs(value);

    return parsed.isValid() ? parsed.format('L') : value;
};

const joinIds = (value: string[] | undefined) =>
    Array.isArray(value) ? value.join(', ') : '';

// The lectures endpoint returns the teacher and lesson collections as plain
// ids (the API exposes no lookups for them), so the table shows what it has.
export const getTableRows = (payload: Lecture[]): LectureRow[] =>
    payload.map((lecture) => ({
        id: lecture._id,
        topic: lecture.topic,
        lesson: joinIds(lecture.lesson),
        teacher: joinIds(lecture.teacher),
        date: formatLectureDate(lecture.date),
        author: lecture.author,
    }));
