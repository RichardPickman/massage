export interface Answer {
    id: string;
    text: string;
}

export interface Question {
    _id: string;
    question: string;
    answers: Answer[];
    correctAnswers: string[];
    img: string | File | null;
}

// Questions held by the constructor have no id until they are saved.
export type QuestionView = Omit<Question, '_id'> & { _id?: string };

export interface Quiz {
    _id: string;
    title: string;
    questions: Question[];
}

export interface QuizPayload {
    title: string;
    questions: string[];
}

export interface QuizSummary {
    _id: string;
    title: string;
    questions: string[];
    // Missing on records created before the API started storing the author.
    author?: string;
}

export interface Lecture {
    _id: string;
    topic: string;
    images: string[];
    teacher: string[];
    lesson: string[];
    date: string;
    // Missing on records created before the API started storing the author.
    author?: string;
}

// The edit form needs the stored S3 keys as well as the signed preview URLs.
export interface LectureDetails extends Lecture {
    imageKeys: string[];
}
