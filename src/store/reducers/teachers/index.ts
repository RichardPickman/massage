import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Teacher } from '../../../services/models';
import { type FetchStatus, fetchStatuses } from '../../../utils/consts';
import { statusCallbacks } from '../staticCallbacks';
import {
    fetchAllTeachers,
    fetchCreate,
    fetchRemove,
    fetchUpdate,
} from './fetch';

export interface TeachersState {
    teachers: Teacher[];
    status: FetchStatus;
    errors: string[];
}

const initialState: TeachersState = {
    teachers: [],
    status: fetchStatuses.IDLE,
    errors: [],
};

export const teachersSlice = createSlice({
    name: 'teachers',
    initialState: initialState,
    reducers: {
        setTeachers: (state, action: PayloadAction<Teacher[]>) => {
            state.teachers = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCreate.fulfilled, (state, action) => {
            state.teachers = action.payload;
        });
        builder.addCase(fetchCreate.pending, statusCallbacks.PENDING);
        builder.addCase(fetchCreate.rejected, (state, action) => {
            statusCallbacks.REJECTED(state);
            state.errors = [action.payload ?? 'Failed to create teacher'];
        });

        builder.addCase(fetchAllTeachers.fulfilled, (state, action) => {
            state.teachers = action.payload;
        });
        builder.addCase(fetchAllTeachers.pending, statusCallbacks.PENDING);
        builder.addCase(fetchAllTeachers.rejected, (state, action) => {
            statusCallbacks.REJECTED(state);
            state.errors = [action.payload ?? 'Failed to fetch teachers'];
        });

        builder.addCase(fetchRemove.fulfilled, (state, action) => {
            state.teachers = action.payload;
        });
        builder.addCase(fetchRemove.pending, statusCallbacks.PENDING);
        builder.addCase(fetchRemove.rejected, (state, action) => {
            statusCallbacks.REJECTED(state);
            state.errors = [action.payload ?? 'Failed to remove teacher'];
        });

        builder.addCase(fetchUpdate.fulfilled, (state, action) => {
            state.teachers = action.payload;
        });
        builder.addCase(fetchUpdate.pending, statusCallbacks.PENDING);
        builder.addCase(fetchUpdate.rejected, (state, action) => {
            statusCallbacks.REJECTED(state);
            state.errors = [action.payload ?? 'Failed to update teacher'];
        });
    },
});

export const { setTeachers } = teachersSlice.actions;

export default teachersSlice.reducer;
