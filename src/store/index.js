import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './reducers/quiz';
import imagesReducer from './reducers/images';

export default configureStore({
    reducer: {
        quiz: quizReducer,
        images: imagesReducer,
    },
});
