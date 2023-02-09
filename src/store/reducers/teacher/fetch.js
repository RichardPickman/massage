import { createAsyncThunk } from '@reduxjs/toolkit';
import TeacherService from '../../../services/Teacher';
import { getFormData } from '../../../utils/formDataConstructor';

export const fetchUpdate = createAsyncThunk(
    'teacher/update',
    async (data, { rejectWithValue }) => {
        try {
            const { id, firstName, lastName, email, img, lessons, ...props } =
                data;
            const payload = getFormData({
                firstName,
                lastName,
                email,
                img,
                lessons: lessons.map((lesson) => lesson.id),
            });
            const response = await TeacherService.update(id, payload);

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchCreate = createAsyncThunk(
    'teacher/create',
    async (data, { rejectWithValue }) => {
        try {
            const payload = getFormData({
                ...data,
                lessons: data.lessons.map((lesson) => lesson.id),
            });
            const response = await TeacherService.createTeacher(payload);

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
