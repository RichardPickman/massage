import { createAsyncThunk } from '@reduxjs/toolkit';
import TeacherService from '../../../services/Teacher';

export const fetchCreate = createAsyncThunk(
    'teacher/create',
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
    'teacher/all',
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
    'teacher/remove',
    async (data, { rejectWithValue }) => {
        try {
            const response = await TeacherService.removeGrip();

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUpdate = createAsyncThunk(
    'teacher/update',
    async (data, { rejectWithValue }) => {
        try {
            const response = await TeacherService.update(data);

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
