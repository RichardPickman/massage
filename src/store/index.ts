import { configureStore } from '@reduxjs/toolkit';
import {
    type TypedUseSelectorHook,
    useDispatch,
    useSelector,
} from 'react-redux';
import userReducer from './reducers/auth/user';
import gripReducer from './reducers/grips';
import imagesReducer from './reducers/images';
import quizReducer from './reducers/quiz';
import quizzesReducer from './reducers/quizzes';
import teacherReducer from './reducers/teacher';
import teachersReducer from './reducers/teachers';

export const store = configureStore({
    reducer: {
        quiz: quizReducer,
        images: imagesReducer,
        auth: userReducer,
        grip: gripReducer,
        teachers: teachersReducer,
        quizzes: quizzesReducer,
        teacher: teacherReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();
