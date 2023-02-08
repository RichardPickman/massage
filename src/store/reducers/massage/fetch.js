import { createAsyncThunk } from '@reduxjs/toolkit';
import MassageService from '../../../services/Massage';
import { parseTechnics } from './helpers';

export const fetchCreate = createAsyncThunk(
    'massage/save',
    async (data, { rejectWithValue }) => {
        try {
            const { title, technics } = data;
            const parsedTechnics = parseTechnics(technics);
            const response = await MassageService.createMassage({
                title: title,
                technics: parsedTechnics,
            });

            return response.payload;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
