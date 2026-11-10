import { createSlice } from '@reduxjs/toolkit';

import type { OverallStats } from '../../../services/types';
import { fetchStatuses, type FetchStatus } from '../../../utils/consts';
import { clearSession } from '../auth/user';
import { fetchOverallStats } from './fetch';

export interface StatsState {
    data: OverallStats | null;
    status: FetchStatus;
    error: string | null;
}

const initialState: StatsState = {
    data: null,
    status: fetchStatuses.IDLE,
    error: null,
};

// The record belongs to the signed-in user, so it is dropped whenever the
// session goes away; the next sign-in refetches it from scratch.
const clearStatsState = (state: StatsState) => {
    state.data = null;
    state.status = fetchStatuses.IDLE;
    state.error = null;
};

const statsSlice = createSlice({
    name: 'stats',
    initialState: initialState,
    reducers: {
        clearStats: (state) => {
            clearStatsState(state);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOverallStats.pending, (state) => {
            state.status = fetchStatuses.PENDING;
            state.error = null;
        });
        builder.addCase(fetchOverallStats.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = fetchStatuses.SUCCEEDED;
            state.error = null;
        });
        builder.addCase(fetchOverallStats.rejected, (state, action) => {
            state.status = fetchStatuses.FAILED;
            state.error = action.payload ?? 'Could not load your stats';
        });
        builder.addCase(clearSession, clearStatsState);
    },
});

export const { clearStats } = statsSlice.actions;

export default statsSlice.reducer;
