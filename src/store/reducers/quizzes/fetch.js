import { createAsyncThunk } from '@reduxjs/toolkit';
import QuizService from '../../../services/Quiz';

export const fetchAll = createAsyncThunk(
    'quizzes/all',
    async (data, { rejectWithValue }) => {
        try {
            const response = await QuizService.getAllQuizzes();
            console.log(response);
            return response.payload;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchRemove = createAsyncThunk(
    'quizzes/remove',
    async (data, { rejectWithValue }) => {
        try {
            const _ = await QuizService.removeQuiz(data.id);
            const allQuizzes = await QuizService.getAllQuizzes();

            return allQuizzes.payload;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error);
        }
    }
);
