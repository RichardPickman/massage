import { createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorMessage } from '../../../services/errors';
import QuizService from '../../../services/Quiz';

// Resolves with the id so the slice can drop just that card. Re-fetching the
// list here would report a failed delete when only the follow-up GET failed.
export const fetchRemove = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('quizzes/remove', (id, { rejectWithValue }) =>
    QuizService.removeQuiz(id)
        .then(() => id)
        .catch((error: unknown) => rejectWithValue(getErrorMessage(error)))
);
