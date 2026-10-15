import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Answer, Question } from '../../services/models';
import { countGrade, saveToHistory, type AnswerHistory } from './helpers';

export interface QuizState {
    questions: Question[];
    title: string;
    currentQuestionIndex: number;
    isFinished: boolean;
    currentAnswerCount: number;
    answers: Answer[];
    correctAnswers: string[];
    currentAnswers: string[];
    history: AnswerHistory[];
    currentQuestion: Question | null;
}

export interface QuizPayload {
    questions: Question[];
    title: string;
}

const initialState: QuizState = {
    questions: [],
    title: '',
    currentQuestionIndex: 0,
    isFinished: false,
    currentAnswerCount: 0,
    answers: [],
    correctAnswers: [],
    currentAnswers: [],
    history: [],
    currentQuestion: null,
};

export const quizSlice = createSlice({
    name: 'quiz',
    initialState: initialState,
    reducers: {
        setQuiz: (state, action: PayloadAction<QuizPayload>) => {
            const [firstQuestion] = action.payload.questions;

            state.questions = action.payload.questions;
            state.title = action.payload.title;
            state.currentQuestionIndex = 0;
            state.isFinished = false;
            state.currentAnswerCount = 0;
            state.answers = [];
            state.currentAnswers = [];
            state.history = [];
            state.correctAnswers = firstQuestion
                ? firstQuestion.correctAnswers
                : [];
            state.currentQuestion = firstQuestion ? firstQuestion : null;
        },
        nextQuestion: (state) => {
            const isFinished =
                state.currentQuestionIndex === state.questions.length - 1;

            const currentQuestionIndex = isFinished
                ? state.currentQuestionIndex
                : state.currentQuestionIndex + 1;

            const currentQuestion = state.questions[currentQuestionIndex];

            const isAnswered = !!state.history[currentQuestionIndex];

            const answeredQuestion =
                isAnswered && state.history[currentQuestionIndex];

            const currentAnswers = isAnswered
                ? answeredQuestion.currentAnswers
                : [];

            const history = saveToHistory(
                state,
                currentAnswers,
                currentQuestionIndex
            );

            state.correctAnswers = currentQuestion.correctAnswers;
            state.currentQuestion = currentQuestion;
            state.currentAnswers = currentAnswers;
            state.currentQuestionIndex = currentQuestionIndex;
            state.isFinished = isFinished;
            state.history = history;
            state.currentAnswerCount = isFinished ? countGrade(state) : 0;
        },
        prevQuestion: (state) => {
            const currentQuestionIndex = state.currentQuestionIndex - 1;
            const currentQuestion = state.questions[currentQuestionIndex];
            const { correctAnswers } = currentQuestion;

            const history = saveToHistory(
                state,
                state.currentAnswers,
                currentQuestionIndex + 1
            );

            const previousEntry = state.history[currentQuestionIndex];

            state.currentQuestionIndex = currentQuestionIndex;
            state.currentQuestion = currentQuestion;
            state.correctAnswers = correctAnswers;
            state.currentAnswers = previousEntry
                ? previousEntry.currentAnswers
                : [];
            state.history = history;
        },
        selectQuestion: (state, action: PayloadAction<{ id: string }>) => {
            const { id } = action.payload;
            const isAnswered = state.currentAnswers.includes(id);
            const currentAnswers = isAnswered
                ? state.currentAnswers.filter((answerId) => answerId !== id)
                : [...state.currentAnswers, id];

            const history = saveToHistory(
                state,
                currentAnswers,
                state.currentQuestionIndex
            );

            state.currentAnswers = currentAnswers;
            state.history = history;
        },
        restart: (_state, action: PayloadAction<QuizPayload>) => {
            const [firstQuestion] = action.payload.questions;

            return {
                ...initialState,
                questions: action.payload.questions,
                title: action.payload.title,
                correctAnswers: firstQuestion
                    ? firstQuestion.correctAnswers
                    : [],
                currentQuestion: firstQuestion ? firstQuestion : null,
            };
        },
    },
});

export const { setQuiz, nextQuestion, prevQuestion, restart, selectQuestion } =
    quizSlice.actions;

export default quizSlice.reducer;
