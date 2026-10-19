import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError, getErrorMessage } from '../../../services/errors';
import {
    getUserFromToken,
    type AuthUser,
} from '../../../services/helpers/getUserFromToken';
import { removeToken, setToken } from '../../../services/helpers/token';
import UserService from '../../../services/User';

export interface AuthPayload {
    token: string;
    user: AuthUser | null;
}

export interface AuthRejectionPayload {
    message: string;
    status: number | null;
}

const toAuthPayload = (token: string): AuthPayload => {
    setToken(token);

    return { token, user: getUserFromToken(token) };
};

// The slice needs the status as well as the text: a 401 means the stored
// token is dead, so the whole session has to go rather than just this request.
const toRejectionPayload = (error: unknown): AuthRejectionPayload => ({
    message: getErrorMessage(error),
    status: error instanceof ApiError ? error.status : null,
});

export const fetchRegister = createAsyncThunk(
    'user/register',
    async (data: Record<string, unknown>, { rejectWithValue }) => {
        try {
            await UserService.registration(data);

            // Registration only creates the account: the user signs in
            // afterwards, so no token is stored and no session is started.
            return null;
        } catch (error) {
            return rejectWithValue(toRejectionPayload(error));
        }
    }
);

export const fetchLogin = createAsyncThunk(
    'user/login',
    async (data: Record<string, unknown>, { rejectWithValue }) => {
        try {
            const response = await UserService.login(data);

            return toAuthPayload(response.token);
        } catch (error) {
            return rejectWithValue(toRejectionPayload(error));
        }
    }
);

export const fetchLogout = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            await UserService.logout();
        } catch (error) {
            return rejectWithValue(toRejectionPayload(error));
        } finally {
            // The server call is best effort: a failure must never keep the
            // session alive on this device, so the token always goes.
            removeToken();
        }

        return null;
    }
);

export const fetchRefresh = createAsyncThunk(
    'user/refresh',
    async (_, { rejectWithValue }) => {
        try {
            const response = await UserService.refreshToken();

            return toAuthPayload(response.token);
        } catch (error) {
            return rejectWithValue(toRejectionPayload(error));
        }
    }
);
