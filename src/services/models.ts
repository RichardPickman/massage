import type { ItemType } from '../utils/itemTypes';

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
    image: string;
}

export interface QuizSummary {
    _id: string;
    title: string;
    questions: string[];
}

export interface Grip {
    _id: string;
    title: string;
}

export interface DraggableGrip extends Grip {
    type: ItemType;
}

export interface Technic {
    _id?: string;
    title: string;
    grips: Grip[];
}

export interface ConstructorTechnic {
    acceptsSelf: ItemType[];
    acceptsChildren: ItemType[];
    id: string;
    title: string;
    grips: Grip[];
}

export interface Massage {
    _id: string;
    title: string;
    technics: Technic[];
}

export interface MassageTechnicPayload {
    title: string;
    grips: string[];
}

export interface MassagePayload {
    title: string;
    technics: MassageTechnicPayload[];
}

export interface Lesson {
    _id: string;
    title: string;
    time: string;
    days: string[];
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

export interface Teacher {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    img: string | null;
    lessons: Lesson[];
}

export interface TeacherFormValues {
    firstName: string;
    lastName: string;
    email: string;
    img: File | null;
    lessons: Lesson[];
}

export interface Beer {
    style: string;
}
