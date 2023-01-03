import { createSlice } from '@reduxjs/toolkit';
import UserService from '../../services/User';

const initialState = {
    user: {},
    isAuth: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setIsAuth: (state, action) => {
            state.isAuth = action;
        },
        setUser: (state, action) => {
            state.user = action;
        },
        login: async (state, action) => {
            try {
                const user = await UserService.login(action);

                console.log(user);
            } catch (error) {
                console.log(error);
            }
        },
        register: async (state, action) => {},
        logout: async (state, action) => {},
        activateAccount: async (state, action) => {},
    },
});

export const { setIsAuth, setUser, login, logout, register, activateAccount } =
    userSlice.actions;

export default userSlice.reducer;
