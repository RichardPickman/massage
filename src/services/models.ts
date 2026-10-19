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
}

export interface Lecture {
    _id: string;
    topic: string;
    images: string[];
    teacher: string[];
    lesson: string[];
    date: string;
}

export interface LectureImages {
    images: string[];
}
