import { createSlice } from '@reduxjs/toolkit';

import type { AuthUser } from '../../../services/helpers/getUserFromToken';
import { getToken } from '../../../services/helpers/token';
import { fetchStatuses, type FetchStatus } from '../../../utils/consts';
import { statusCallbacks } from '../staticCallbacks';
import {
    fetchLogin,
    fetchLogout,
    fetchRefresh,
    fetchRegister,
    type AuthRejectionPayload,
} from './fetch';

export interface AuthState {
    user: AuthUser | null;
    isAuth: boolean;
    error: string | null;
    status: FetchStatus;
    isRestoringSession: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuth: false,
    error: null,
    status: fetchStatuses.IDLE,
    // A token left in storage at boot means the app has to refresh it before
    // it knows whether the visitor is signed in, so guarded routes wait.
    isRestoringSession: Boolean(getToken()),
};

const readRejection = (payload: unknown): AuthRejectionPayload | null => {
    if (typeof payload !== 'object' || payload === null) {
        return null;
    }

    if (!('message' in payload) || !('status' in payload)) {
        return null;
    }

    const { message, status } = payload;

    if (typeof message !== 'string') {
        return null;
    }

    return {
        message,
        status: typeof status === 'number' ? status : null,
    };
};

// Signed out means signed out everywhere: no stale user for the account menu
// to render and no stale status for the rest of the app to act on.
const clearSessionState = (state: AuthState) => {
    state.user = null;
    state.isAuth = false;
    state.error = null;
    state.status = fetchStatuses.IDLE;
    state.isRestoringSession = false;
};

// The auth slice adds `isAuth` and `error` handling on top of the shared
// callbacks, so rejection always leaves a serializable message behind.
const handleAuthRejection = (
    state: AuthState,
    action: { payload?: unknown }
) => {
    const rejection = readRejection(action.payload);

    state.status = fetchStatuses.FAILED;
    state.isAuth = false;
    state.error = rejection?.message ?? 'Authentication request failed';
};

// A refresh rejected with 401 means the stored token is dead, so the session
// goes the same way a manual logout does instead of leaving a half-session.
const handleRefreshRejection = (
    state: AuthState,
    action: { payload?: unknown }
) => {
    const rejection = readRejection(action.payload);

    if (rejection?.status === 401) {
        clearSessionState(state);

        return;
    }

    handleAuthRejection(state, action);
};

const authStatusCallbacks = {
    ...statusCallbacks,
    REJECTED: handleAuthRejection,
};

export const userSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        clearSession: (state) => {
            clearSessionState(state);
        },
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

        // Logout signs the user out the moment it starts, so the header never
        // shows a stale account while the server call is in flight, and stays
        // signed out whether that call succeeds or fails.
        builder.addCase(fetchLogout.pending, clearSessionState);
        builder.addCase(fetchLogout.fulfilled, clearSessionState);
        builder.addCase(fetchLogout.rejected, clearSessionState);

        builder.addCase(fetchRefresh.pending, (state) => {
            authStatusCallbacks.PENDING(state);
            state.isRestoringSession = true;
        });
        builder.addCase(fetchRefresh.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.isAuth = Boolean(action.payload.user);
            state.status = fetchStatuses.SUCCEEDED;
            state.isRestoringSession = false;
        });
        builder.addCase(fetchRefresh.rejected, (state, action) => {
            state.isRestoringSession = false;
            handleRefreshRejection(state, action);
        });
    },
});

export const { clearSession, clearUser, clearError, cleanUp } =
    userSlice.actions;

export default userSlice.reducer;
