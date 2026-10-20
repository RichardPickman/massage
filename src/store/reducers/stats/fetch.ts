import { createAsyncThunk } from '@reduxjs/toolkit';

import { getErrorMessage } from '../../../services/errors';
import StatsService from '../../../services/Stats';
import type { OverallStats } from '../../../services/types';

export const fetchOverallStats = createAsyncThunk<
    OverallStats,
    void,
    { rejectValue: string }
>('stats/fetchOverall', (_, { rejectWithValue }) =>
    StatsService.getMine()
        .then(({ payload }) => payload)
        .catch((error: unknown) => rejectWithValue(getErrorMessage(error)))
);
