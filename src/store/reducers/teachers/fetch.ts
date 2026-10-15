import { createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorMessage } from '../../../services/errors';
import TeacherService from '../../../services/Teacher';
import type { Teacher } from '../../../services/models';
import { getFormData } from '../../../utils/formDataConstructor';
import type { TeacherUpdatePayload } from '../teacher/fetch';

export const fetchCreate = createAsyncThunk<
    Teacher[],
    TeacherUpdatePayload,
    { rejectValue: string }
>('teachers/create', (values, { rejectWithValue }) =>
    TeacherService.createTeacher(
        getFormData({
            ...values,
            lessons: values.lessons.map((lesson) => lesson._id),
        })
    )
        .then(() => TeacherService.getAllTeachers())
        .catch((error: unknown) => rejectWithValue(getErrorMessage(error)))
);

export const fetchAllTeachers = createAsyncThunk<
    Teacher[],
    void,
    { rejectValue: string }
>('teachers/all', (_, { rejectWithValue }) =>
    TeacherService.getAllTeachers().catch((error: unknown) =>
        rejectWithValue(getErrorMessage(error))
    )
);

export const fetchRemove = createAsyncThunk<
    Teacher[],
    string,
    { rejectValue: string }
>('teachers/remove', (id, { rejectWithValue }) =>
    TeacherService.removeTeacher(id)
        .then(() => TeacherService.getAllTeachers())
        .catch((error: unknown) => rejectWithValue(getErrorMessage(error)))
);

export const fetchUpdate = createAsyncThunk<
    Teacher[],
    TeacherUpdatePayload,
    { rejectValue: string }
>('teachers/update', (values, { rejectWithValue }) =>
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
