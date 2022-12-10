import { countGrade, saveToHistory } from './helpers';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
        setQuiz: (state, action) => {
            state.questions = action.payload.questions;
            state.title = action.payload.title;
            state.correctAnswers = action.payload.questions[0].correctAnswers;
            state.currentQuestion = action.payload.questions[0];
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

            const currentAnswers =
                state.history[currentQuestionIndex].currentAnswers;

            state.currentQuestionIndex = currentQuestionIndex;
            state.currentQuestion = currentQuestion;
            state.correctAnswers = correctAnswers;
            state.currentAnswers = currentAnswers;
            state.history = history;
        },
        selectQuestion: (state, action) => {
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
        restart: (state, action) => {
            return {
                ...initialState,
                questions: action.payload.questions,
                correctAnswers: action.payload.questions[0].correctAnswers,
                currentQuestion: action.payload.questions[0],
            };
        },
    },
});

export const { setQuiz, nextQuestion, prevQuestion, restart, selectQuestion } =
    quizSlice.actions;

export default quizSlice.reducer;
