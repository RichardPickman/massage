import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit';
import { getErrorMessage } from '../../services/errors';
import QuizService from '../../services/Quiz';
import type { Question } from '../../services/models';
import type {
    QuizStats,
    SubmitResult,
    SubmittedAnswer,
} from '../../services/types';
import { saveToHistory, type AnswerHistory } from './helpers';

export interface QuizState {
    questions: Question[];
    title: string;
    currentQuestionIndex: number;
    isFinished: boolean;
    correctAnswers: string[];
    currentAnswers: string[];
    history: AnswerHistory[];
    currentQuestion: Question | null;
    submission: SubmitResult | null;
    isSubmitting: boolean;
    submitError: string | null;
    stats: QuizStats | null;
    isFetchingStats: boolean;
    statsError: string | null;
}

export interface QuizPayload {
    questions: Question[];
    title: string;
}

export interface SubmitPayload {
    quizId: string;
    answers: SubmittedAnswer[];
}

const initialState: QuizState = {
    questions: [],
    title: '',
    currentQuestionIndex: 0,
    isFinished: false,
    correctAnswers: [],
    currentAnswers: [],
    history: [],
    currentQuestion: null,
    submission: null,
    isSubmitting: false,
    submitError: null,
    stats: null,
    isFetchingStats: false,
    statsError: null,
};

// Grading happens on the server so a score can never be spoofed from the
// client. The response carries the correct answers, which is what the result
// view colours the questions with.
export const submitAttempt = createAsyncThunk<
    SubmitResult,
    SubmitPayload,
    { rejectValue: string }
>('quiz/submit', ({ quizId, answers }, { rejectWithValue }) =>
    QuizService.submitQuiz(quizId, answers)
        .then(({ payload }) => payload)
        .catch((error: unknown) => rejectWithValue(getErrorMessage(error)))
);

// The result view refetches the summary once the submission lands, so the
// attempt just made counts. The server owns the numbers.
export const fetchQuizStats = createAsyncThunk<
    QuizStats,
    string,
    { rejectValue: string }
>('quiz/stats', (quizId, { rejectWithValue }) =>
    QuizService.getQuizStats(quizId)
        .then(({ payload }) => payload)
        .catch((error: unknown) => rejectWithValue(getErrorMessage(error)))
);

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
            state.currentAnswers = [];
            state.history = [];
            state.submission = null;
            state.isSubmitting = false;
            state.submitError = null;
            state.stats = null;
            state.isFetchingStats = false;
            state.statsError = null;
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
    extraReducers: (builder) => {
        builder
            .addCase(submitAttempt.pending, (state) => {
                state.isSubmitting = true;
                state.submitError = null;
            })
            .addCase(submitAttempt.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.submission = action.payload;
                // A fresh attempt makes the previous summary stale until the
                // result view refetches it.
                state.stats = null;
                state.statsError = null;
            })
            .addCase(submitAttempt.rejected, (state, action) => {
                state.isSubmitting = false;
                state.submitError =
                    action.payload ?? 'Could not grade this quiz';
            });

        builder
            .addCase(fetchQuizStats.pending, (state) => {
                state.isFetchingStats = true;
                state.statsError = null;
            })
            .addCase(fetchQuizStats.fulfilled, (state, action) => {
                state.isFetchingStats = false;
                state.stats = action.payload;
            })
            .addCase(fetchQuizStats.rejected, (state, action) => {
                state.isFetchingStats = false;
                state.statsError =
                    action.payload ?? 'Could not load your stats';
            });
    },
});

export const { setQuiz, nextQuestion, prevQuestion, restart, selectQuestion } =
    quizSlice.actions;

export default quizSlice.reducer;
