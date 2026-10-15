import { createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorMessage } from '../../../services/errors';
import QuizService from '../../../services/Quiz';
import type { QuizSummary } from '../../../services/models';

export const fetchAll = createAsyncThunk<
    QuizSummary[],
    void,
    { rejectValue: string }
>('quizzes/all', (_, { rejectWithValue }) =>
    QuizService.getAllQuizzes()
        .then(({ payload }) => payload)
        .catch((error: unknown) => rejectWithValue(getErrorMessage(error)))
);

export const fetchRemove = createAsyncThunk<
    QuizSummary[],
    string,
    { rejectValue: string }
>('quizzes/remove', (id, { rejectWithValue }) =>
    QuizService.removeQuiz(id)
        .then(() => QuizService.getAllQuizzes())
        .then(({ payload }) => payload)
        .catch((error: unknown) => rejectWithValue(getErrorMessage(error)))
);
