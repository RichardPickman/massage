import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { QuizSummary } from '../../../services/models';
import type { Page } from '../../../services/types';
import { type FetchStatus, fetchStatuses } from '../../../utils/consts';
import { statusCallbacks } from '../staticCallbacks';
import { fetchRemove } from './fetch';

// The slice keeps one page of quizzes, never the archive: the numbers travel
// with the rows so the paginator and the totals cannot disagree.
export interface QuizzesState {
    quizzes: QuizSummary[];
    page: number;
    pages: number;
    total: number;
    status: FetchStatus;
    errors: string[];
    // Bumped by every fulfilled removal. The listing watches it to reload its
    // page, which is how total and pages catch up with the server.
    revision: number;
}

const initialState: QuizzesState = {
    quizzes: [],
    page: 1,
    pages: 0,
    total: 0,
    status: fetchStatuses.IDLE,
    errors: [],
    revision: 0,
};

const quizzesSlice = createSlice({
    name: 'quizzes',
    initialState: initialState,
    reducers: {
        setQuizzes: (state, action: PayloadAction<Page<QuizSummary>>) => {
            state.quizzes = action.payload.items;
            state.page = action.payload.page;
            state.pages = action.payload.pages;
            state.total = action.payload.total;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRemove.fulfilled, (state, action) => {
            state.quizzes = state.quizzes.filter(
                (quiz) => quiz._id !== action.payload
            );
            state.revision += 1;
        });
        builder.addCase(fetchRemove.pending, statusCallbacks.PENDING);
        builder.addCase(fetchRemove.rejected, (state, action) => {
            statusCallbacks.REJECTED(state);
            state.errors = [action.payload ?? 'Failed to remove quiz'];
        });
    },
});

export const { setQuizzes } = quizzesSlice.actions;

export default quizzesSlice.reducer;
