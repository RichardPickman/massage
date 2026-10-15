import { createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorMessage } from '../../../services/errors';
import TeacherService from '../../../services/Teacher';
import type { Teacher, TeacherFormValues } from '../../../services/models';
import { getFormData } from '../../../utils/formDataConstructor';

export type TeacherUpdatePayload = TeacherFormValues & { id: string };

export const fetchCreate = createAsyncThunk<
    Teacher[],
    TeacherUpdatePayload,
    { rejectValue: string }
>('teacher/create', (values, { rejectWithValue }) =>
    TeacherService.createTeacher(
        getFormData({
            ...values,
            lessons: values.lessons.map((lesson) => lesson._id),
        })
    )
        .then(() => TeacherService.getAllTeachers())
        .catch((error: unknown) => rejectWithValue(getErrorMessage(error)))
);

export const fetchUpdate = createAsyncThunk<
    Teacher[],
    TeacherUpdatePayload,
    { rejectValue: string }
>('teacher/update', (values, { rejectWithValue }) =>
    TeacherService.update(
        values.id,
        getFormData({
            ...values,
            lessons: values.lessons.map((lesson) => lesson._id),
        })
    )
        .then(() => TeacherService.getAllTeachers())
        .catch((error: unknown) => rejectWithValue(getErrorMessage(error)))
);
