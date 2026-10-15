import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { QuizSummary } from '../../../services/models';
import { type FetchStatus, fetchStatuses } from '../../../utils/consts';
import { statusCallbacks } from '../staticCallbacks';
import { fetchAll, fetchRemove } from './fetch';

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
        builder.addCase(fetchAll.fulfilled, (state, action) => {
            state.quizzes = action.payload;
        });
        builder.addCase(fetchAll.pending, statusCallbacks.PENDING);
        builder.addCase(fetchAll.rejected, (state, action) => {
            statusCallbacks.REJECTED(state);
            state.errors = [action.payload ?? 'Failed to fetch quizzes'];
        });

        builder.addCase(fetchRemove.fulfilled, (state, action) => {
            state.quizzes = action.payload;
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
