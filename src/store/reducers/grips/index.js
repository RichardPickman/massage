import { createSlice } from '@reduxjs/toolkit';
import { fetchStatuses } from '../../../utils/consts';
import { statusCallbacks } from '../staticCallbacks';
import { fetchCreate, fetchAllGrips, fetchRemove, fetchUpdate } from './fetch';

const initialState = {
    grips: [],
    status: fetchStatuses.IDLE,
};

export const gripsSlice = createSlice({
    name: 'grip',
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchCreate.fulfilled, (state, action) => {
            state.grips = action.payload;
            state.status = fetchStatuses.SUCCEEDED;
        });
        builder.addCase(fetchCreate.pending, statusCallbacks.PENDING);
        builder.addCase(fetchCreate.rejected, statusCallbacks.REJECTED);

        builder.addCase(fetchAllGrips.fulfilled, (state, action) => {
            state.grips = action.payload;
            state.status = fetchStatuses.SUCCEEDED;
        });
        builder.addCase(fetchAllGrips.pending, statusCallbacks.PENDING);
        builder.addCase(fetchAllGrips.rejected, statusCallbacks.REJECTED);

        builder.addCase(fetchRemove.fulfilled, (state, action) => {
            state.grips = action.payload;
            state.status = fetchStatuses.SUCCEEDED;
        });
        builder.addCase(fetchRemove.pending, statusCallbacks.PENDING);
        builder.addCase(fetchRemove.rejected, statusCallbacks.REJECTED);

        builder.addCase(fetchUpdate.fulfilled, (state, action) => {
            state.grips = action.payload;
            state.status = fetchStatuses.SUCCEEDED;
        });
        builder.addCase(fetchUpdate.pending, statusCallbacks.PENDING);
        builder.addCase(fetchUpdate.rejected, statusCallbacks.REJECTED);
    },
});

export default gripsSlice.reducer;
