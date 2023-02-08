import { createAsyncThunk } from '@reduxjs/toolkit';
import GripsService from '../../../services/Grip';

export const fetchCreate = createAsyncThunk(
    'grip/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await GripsService.createGrip(data);
            const grips = await GripsService.getAllGrips();

            return grips;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchAllGrips = createAsyncThunk(
    'grip/all',
    async (data, { rejectWithValue }) => {
        try {
            const response = await GripsService.getAllGrips();

            if (Array.isArray(response)) {
                return response;
            }

            return [response];
        } catch (error) {
            console.log(error);
            return rejectWithValue(error);
        }
    }
);

export const fetchRemove = createAsyncThunk(
    'grip/remove',
    async (data, { rejectWithValue }) => {
        try {
            const response = await GripsService.removeGrip(data);
            const allGrips = await GripsService.getAllGrips();

            return allGrips;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUpdate = createAsyncThunk(
    'grip/update',
    async (data, { rejectWithValue }) => {
        try {
            const response = await GripsService.update(data);

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
