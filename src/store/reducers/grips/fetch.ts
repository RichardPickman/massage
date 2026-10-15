import { createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorMessage } from '../../../services/errors';
import GripService from '../../../services/Grip';
import type { Grip } from '../../../services/models';

export const fetchCreate = createAsyncThunk<
    Grip[],
    { title: string },
    { rejectValue: string }
>('grip/create', async (data, { rejectWithValue }) => {
    try {
        await GripService.createGrip(data);

        return await GripService.getAllGrips();
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const fetchAllGrips = createAsyncThunk<
    Grip[],
    void,
    { rejectValue: string }
>('grip/all', async (_, { rejectWithValue }) => {
    try {
        return await GripService.getAllGrips();
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const fetchRemove = createAsyncThunk<
    Grip[],
    string,
    { rejectValue: string }
>('grip/remove', async (id, { rejectWithValue }) => {
    try {
        await GripService.removeGrip(id);

        return await GripService.getAllGrips();
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const fetchUpdate = createAsyncThunk<
    Grip[],
    { id: string; title: string },
    { rejectValue: string }
>('grip/update', async (data, { rejectWithValue }) => {
    try {
        await GripService.update(data);

        return await GripService.getAllGrips();
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});
