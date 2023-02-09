import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './reducers/quiz';
import imagesReducer from './reducers/images';
import userReducer from './reducers/auth/user';
import gripReducer from './reducers/grips';
import teachersReducer from './reducers/teachers';
import teacherReducer from './reducers/teacher';
import massageReducer from './reducers/massage';
import quizzesReducer from './reducers/quizzes';
import thunk from 'redux-thunk';

export default configureStore({
    reducer: {
        quiz: quizReducer,
        images: imagesReducer,
        auth: userReducer,
        grip: gripReducer,
        teachers: teachersReducer,
        massage: massageReducer,
        quizzes: quizzesReducer,
        teacher: teacherReducer,
    },
    middleware: [thunk],
});
