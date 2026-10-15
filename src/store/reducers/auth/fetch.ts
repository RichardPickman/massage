import { createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorMessage } from '../../../services/errors';
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

const toAuthPayload = (token: string): AuthPayload => {
    setToken(token);

    return { token, user: getUserFromToken(token) };
};

export const fetchRegister = createAsyncThunk(
    'user/register',
    async (data: Record<string, unknown>, { rejectWithValue }) => {
        try {
            await UserService.registration(data);

            // Registration only creates the account: the user signs in
            // afterwards, so no token is stored and no session is started.
            return null;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
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
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchLogout = createAsyncThunk(
    'user/logout',
    (_, { rejectWithValue }) => {
        try {
            removeToken();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
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
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

