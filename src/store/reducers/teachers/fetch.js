import { createAsyncThunk } from '@reduxjs/toolkit';
import TeacherService from '../../../services/Teacher';

export const fetchCreate = createAsyncThunk(
    'teachers/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await TeacherService.createGrip(data);

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchAllTeachers = createAsyncThunk(
    'teachers/all',
    async (data, { rejectWithValue }) => {
        try {
            const response = await TeacherService.getAllTeachers();

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchRemove = createAsyncThunk(
    'teachers/remove',
    async (data, { rejectWithValue }) => {
        try {
            const _ = await TeacherService.removeTeacher(data);
            const teachers = await TeacherService.getAllTeachers();

            return teachers;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUpdate = createAsyncThunk(
    'teachers/update',
    async (data, { rejectWithValue }) => {
        try {
            const response = await TeacherService.update(data);

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
