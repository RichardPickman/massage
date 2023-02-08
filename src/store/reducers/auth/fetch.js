import { createAsyncThunk } from '@reduxjs/toolkit';
import UserService from '../../../services/User';

const setToken = (token) => localStorage.setItem('token', `Bearer ${token}`);

const removeToken = () => localStorage.removeItem('token');

export const fetchRegister = createAsyncThunk(
    'user/register',
    async (data, { rejectWithValue }) => {
        try {
            const response = await UserService.registration(data);

            setToken(response.accessToken);

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchLogin = createAsyncThunk(
    'user/login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await UserService.login(data);

            setToken(response.accessToken);

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchLogout = createAsyncThunk(
    'user/logout',
    async (response, { rejectWithValue }) => {
        try {
            const response = await UserService.logout();

            removeToken();

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchRefresh = createAsyncThunk(
    'user/refresh',
    async (response, { rejectWithValue }) => {
        try {
            const response = await UserService.refreshToken();

            setToken(response.accessToken);

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
