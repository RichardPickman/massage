import { createSlice } from '@reduxjs/toolkit';
import { fetchStatuses } from '../../../utils/consts';
import { statusCallbacks } from '../staticCallbacks';
import {
    fetchCreate,
    fetchRemove,
    fetchUpdate,
    fetchAllTeachers,
} from './fetch';

const initialState = {
    teachers: [],
    isAuth: false,
    error: null,
    status: fetchStatuses.IDLE,
    allowRedirect: false,
};

export const teacherSlice = createSlice({
    name: 'teachers',
    initialState: initialState,
    reducers: {
        setTeachers: (state, action) => {
            state.teachers = action.payload.teachers;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCreate.fulfilled, (state, action) => {
            state.teachers = action.payload;
        });
        builder.addCase(fetchCreate.pending, statusCallbacks.PENDING);
        builder.addCase(fetchCreate.rejected, statusCallbacks.REJECTED);

        builder.addCase(fetchAllTeachers.fulfilled, (state, action) => {
            state.teachers = action.payload;
        });
        builder.addCase(fetchAllTeachers.pending, statusCallbacks.PENDING);
        builder.addCase(fetchAllTeachers.rejected, statusCallbacks.REJECTED);

        builder.addCase(fetchRemove.fulfilled, (state, action) => {
            state.teachers = action.payload;
        });
        builder.addCase(fetchRemove.pending, statusCallbacks.PENDING);
        builder.addCase(fetchRemove.rejected, statusCallbacks.REJECTED);

        builder.addCase(fetchUpdate.fulfilled, (state, action) => {
            state.teachers = action.payload;
        });
        builder.addCase(fetchUpdate.pending, statusCallbacks.PENDING);
        builder.addCase(fetchUpdate.rejected, statusCallbacks.REJECTED);
    },
});

export const { setTeachers } = teacherSlice.actions;

export default teacherSlice.reducer;
