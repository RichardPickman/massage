import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './reducers/quiz';
import imagesReducer from './reducers/images';
import userReducer from './reducers/user';

export default configureStore({
    reducer: {
        quiz: quizReducer,
        images: imagesReducer,
        user: userReducer,
    },
});
