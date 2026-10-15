import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Lesson, TeacherFormValues } from '../../../services/models';
import { type FetchStatus, fetchStatuses } from '../../../utils/consts';
import { statusCallbacks } from '../staticCallbacks';
import { fetchCreate, fetchUpdate } from './fetch';

export interface TeacherState {
    firstName: string;
    lastName: string;
    email: string;
    img: File | null;
    lessons: Lesson[];
    status: FetchStatus;
    errors: string[];
}

const initialState: TeacherState = {
    firstName: '',
    lastName: '',
    email: '',
    img: null,
    lessons: [],
    status: fetchStatuses.IDLE,
    errors: [],
};

const teacherSlice = createSlice({
    name: 'teacher',
    initialState: initialState,
    reducers: {
        changeFirstName: (state, action: PayloadAction<string>) => {
            state.firstName = action.payload;
        },
        changeLastName: (state, action: PayloadAction<string>) => {
            state.lastName = action.payload;
        },
        changeEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        changeImage: (state, action: PayloadAction<File | null>) => {
            state.img = action.payload;
        },
        changeLessons: (state, action: PayloadAction<Lesson[]>) => {
            state.lessons = action.payload;
        },
        setEditTeacher: (state, action: PayloadAction<TeacherFormValues>) => {
            const { firstName, lastName, email, img, lessons } =
                action.payload;

            state.firstName = firstName;
            state.lastName = lastName;
            state.email = email;
            state.img = img;
            state.lessons = lessons;
        },
        clearState: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCreate.fulfilled, (state) => {
            state.status = fetchStatuses.SUCCEEDED;
        });
        builder.addCase(fetchCreate.pending, statusCallbacks.PENDING);
        builder.addCase(fetchCreate.rejected, (state, action) => {
            statusCallbacks.REJECTED(state);
            state.errors = [action.payload ?? 'Failed to create teacher'];
        });

        builder.addCase(fetchUpdate.fulfilled, (state) => {
            state.status = fetchStatuses.SUCCEEDED;
        });
        builder.addCase(fetchUpdate.pending, statusCallbacks.PENDING);
        builder.addCase(fetchUpdate.rejected, (state, action) => {
            statusCallbacks.REJECTED(state);
            state.errors = [action.payload ?? 'Failed to update teacher'];
        });
    },
});

export const {
    changeFirstName,
    changeLastName,
    changeEmail,
    changeImage,
    changeLessons,
    setEditTeacher,
    clearState,
} = teacherSlice.actions;

export default teacherSlice.reducer;
