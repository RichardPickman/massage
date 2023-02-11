import { createSlice } from '@reduxjs/toolkit';
import { fetchStatuses } from '../../../utils/consts';
import { statusCallbacks } from '../staticCallbacks';
import { fetchCreate, fetchUpdate } from './fetch';

const initialState = {
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
        changeFirstName: (state, action) => {
            state.firstName = action.payload;
        },
        changeLastName: (state, action) => {
            state.lastName = action.payload;
        },
        changeEmail: (state, action) => {
            state.email = action.payload;
        },
        changeImage: (state, action) => {
            state.img = action.payload;
        },
        changeLessons: (state, action) => {
            state.lessons = action.payload;
        },
        setEditTeacher: (state, action) => {
            const { firstName, lastName, email, img, lessons } = action.payload;

            return {
                ...initialState,
                firstName,
                lastName,
                email,
                img,
                lessons,
            };
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
        builder.addCase(fetchCreate.rejected, statusCallbacks.REJECTED);

        builder.addCase(fetchUpdate.fulfilled, (state) => {
            state.status = fetchStatuses.SUCCEEDED;
        });
        builder.addCase(fetchUpdate.pending, statusCallbacks.PENDING);
        builder.addCase(fetchUpdate.rejected, statusCallbacks.REJECTED);
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
