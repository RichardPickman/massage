import { createSlice } from '@reduxjs/toolkit';
import { fetchStatuses } from '../../../utils/consts';
import { statusCallbacks } from '../staticCallbacks';
import { fetchAll, fetchRemove } from './fetch';

const initialState = {
    quizzes: [],
    status: fetchStatuses.IDLE,
    errors: [],
};

const quizzesSlice = createSlice({
    name: 'quizzes',
    initialState: initialState,
    reducers: {
        setQuizzes: (state, action) => {
            state.quizzes = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAll.fulfilled, (state, action) => {
            state.quizzes = action.payload;
        });
        builder.addCase(fetchAll.pending, statusCallbacks.PENDING);
        builder.addCase(fetchAll.rejected, statusCallbacks.REJECTED);

        builder.addCase(fetchRemove.fulfilled, (state, action) => {
            state.quizzes = action.payload;
        });
        builder.addCase(fetchRemove.pending, statusCallbacks.PENDING);
        builder.addCase(fetchRemove.rejected, statusCallbacks.REJECTED);
    },
});

export const { setQuizzes } = quizzesSlice.actions;

export default quizzesSlice.reducer;
