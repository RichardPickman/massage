import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { QuizSummary } from '../../../services/models';
import { type FetchStatus, fetchStatuses } from '../../../utils/consts';
import { statusCallbacks } from '../staticCallbacks';
import { fetchRemove } from './fetch';

export interface QuizzesState {
    quizzes: QuizSummary[];
    status: FetchStatus;
    errors: string[];
}

const initialState: QuizzesState = {
    quizzes: [],
    status: fetchStatuses.IDLE,
    errors: [],
};

const quizzesSlice = createSlice({
    name: 'quizzes',
    initialState: initialState,
    reducers: {
        setQuizzes: (state, action: PayloadAction<QuizSummary[]>) => {
            state.quizzes = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRemove.fulfilled, (state, action) => {
            state.quizzes = state.quizzes.filter(
                (quiz) => quiz._id !== action.payload
            );
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
