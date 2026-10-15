import { createSlice } from '@reduxjs/toolkit';

import type { AuthUser } from '../../../services/helpers/getUserFromToken';
import { fetchStatuses, type FetchStatus } from '../../../utils/consts';
import { statusCallbacks } from '../staticCallbacks';
import { fetchLogin, fetchLogout, fetchRefresh, fetchRegister } from './fetch';

export interface AuthState {
    user: AuthUser | null;
    isAuth: boolean;
    error: string | null;
    status: FetchStatus;
}

const initialState: AuthState = {
    user: null,
    isAuth: false,
    error: null,
    status: fetchStatuses.IDLE,
};

// The auth slice adds `isAuth` and `error` handling on top of the shared
// callbacks, so rejection always leaves a serializable message behind.
const handleAuthRejection = (
    state: AuthState,
    action: { payload?: unknown }
) => {
    state.status = fetchStatuses.FAILED;
    state.isAuth = false;
    state.error =
        typeof action.payload === 'string'
            ? action.payload
            : 'Authentication request failed';
};

const authStatusCallbacks = {
    ...statusCallbacks,
    REJECTED: handleAuthRejection,
};

export const userSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        clearUser: (state) => {
            state.user = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        cleanUp: (state) => {
            state.error = null;
            state.status = fetchStatuses.IDLE;
        },
    },
    extraReducers: (builder) => {
        // Registration never authenticates: the user signs in afterwards,
        // which is why nothing but the request status changes here.
        builder.addCase(fetchRegister.fulfilled, (state) => {
            state.status = fetchStatuses.SUCCEEDED;
        });
        builder.addCase(fetchRegister.pending, authStatusCallbacks.PENDING);
        builder.addCase(fetchRegister.rejected, authStatusCallbacks.REJECTED);

        builder.addCase(fetchLogin.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.isAuth = Boolean(action.payload.user);
            state.status = fetchStatuses.SUCCEEDED;
        });
        builder.addCase(fetchLogin.pending, authStatusCallbacks.PENDING);
        builder.addCase(fetchLogin.rejected, authStatusCallbacks.REJECTED);

        builder.addCase(fetchLogout.fulfilled, (state) => {
            state.user = null;
            state.isAuth = false;
            state.status = fetchStatuses.SUCCEEDED;
        });
        builder.addCase(fetchLogout.pending, authStatusCallbacks.PENDING);
        builder.addCase(fetchLogout.rejected, authStatusCallbacks.REJECTED);

        builder.addCase(fetchRefresh.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.isAuth = Boolean(action.payload.user);
            state.status = fetchStatuses.SUCCEEDED;
        });
        builder.addCase(fetchRefresh.pending, authStatusCallbacks.PENDING);
        builder.addCase(fetchRefresh.rejected, authStatusCallbacks.REJECTED);
    },
});

export const { clearUser, clearError, cleanUp } = userSlice.actions;

export default userSlice.reducer;
