import { createSlice } from '@reduxjs/toolkit';
import { fetchStatuses } from '../../../utils/consts';

import { fetchRegister, fetchLogin, fetchLogout, fetchRefresh } from './fetch';

const initialState = {
    user: null,
    isAuth: false,
    error: null,
    status: fetchStatuses.IDLE,
    allowRedirect: false,
};

const statusCallbacks = {
    PENDING: (state) => {
        state.status = fetchStatuses.PENDING;
    },
    IDLE: (state) => {
        state.status = fetchStatuses.IDLE;
    },
    REJECTED: (state, action) => {
        state.status = fetchStatuses.FAILED;
        state.isAuth = false;
        state.error = action.payload;
    },
};

export const userSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        clearUser: (state) => {
            state.user = {};
        },
        clearError: (state) => {
            state.error = null;
        },
        cleanUp: (state) => {
            state.error = null;
            state.status = fetchStatuses.IDLE;
            state.allowRedirect = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRegister.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.status = fetchStatuses.SUCCEEDED;
            state.allowRedirect = true;
            state.isAuth = true;
        });
        builder.addCase(fetchRegister.pending, statusCallbacks.PENDING);
        builder.addCase(fetchRegister.rejected, statusCallbacks.REJECTED);

        builder.addCase(fetchLogin.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.isAuth = true;
            state.status = fetchStatuses.SUCCEEDED;
            state.allowRedirect = true;
        });
        builder.addCase(fetchLogin.pending, statusCallbacks.PENDING);
        builder.addCase(fetchLogin.rejected, statusCallbacks.REJECTED);

        builder.addCase(fetchLogout.fulfilled, (state) => {
            state.user = {};
            state.isAuth = false;
            state.status = fetchStatuses.SUCCEEDED;
            state.allowRedirect = true;
        });
        builder.addCase(fetchLogout.pending, statusCallbacks.PENDING);
        builder.addCase(fetchLogout.rejected, statusCallbacks.REJECTED);

        builder.addCase(fetchRefresh.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.isAuth = true;
            state.status = fetchStatuses.SUCCEEDED;
        });
        builder.addCase(fetchRefresh.pending, statusCallbacks.PENDING);
        builder.addCase(fetchRefresh.rejected, statusCallbacks.REJECTED);
    },
});

export const { clearUser, clearError, cleanUp, isActivated } =
    userSlice.actions;

export default userSlice.reducer;
