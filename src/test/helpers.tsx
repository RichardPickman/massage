import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import type { AuthUser } from '../services/helpers/getUserFromToken';
import { fetchLogin } from '../store/reducers/auth/fetch';
import userReducer from '../store/reducers/auth/user';
import imagesReducer from '../store/reducers/images';
import quizReducer from '../store/reducers/quiz';
import quizzesReducer from '../store/reducers/quizzes';

export const testUser: AuthUser = {
    id: 'user-1',
    email: 'author@example.com',
    role: 'admin',
};

export const makeStore = () =>
    configureStore({
        reducer: {
            quiz: quizReducer,
            images: imagesReducer,
            auth: userReducer,
            quizzes: quizzesReducer,
        },
    });

export type TestStore = ReturnType<typeof makeStore>;

// The slice has no "set user" action, so the fulfilled login action is the
// supported way to put a session into a fresh store.
export const signIn = (store: TestStore) => {
    store.dispatch(
        fetchLogin.fulfilled(
            { token: 'test-token', user: testUser },
            'test-request',
            { email: testUser.email, password: 'test-password' }
        )
    );
};

type TestRoute =
    | string
    | {
          pathname: string;
          search?: string;
          hash?: string;
          state?: unknown;
      };

interface RenderWithProvidersOptions {
    store: TestStore;
    route?: TestRoute;
}

export const renderWithProviders = (
    ui: ReactNode,
    { store, route = '/' }: RenderWithProvidersOptions
) =>
    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </Provider>
    );
