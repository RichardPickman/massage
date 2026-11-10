import type { Lecture } from '../../services/models';

export interface LectureRow {
    id: string;
    topic: string;
    lesson: string;
    teacher: string;
    date: string;
    author?: string;
}

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
        date: lecture.date,
        author: lecture.author,
    }));
