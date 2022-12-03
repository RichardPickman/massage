import React from 'react';
import QuizConstructor from '../../pages/QuizConstructor';
import Quiz, { loader as quizLoader } from '../../pages/Quiz';
import Error from '../../pages/Error';
import Quizzes, { loader as quizzesLoader } from '../../pages/Quizzes';
import QuizLayout from '../../layouts/Quiz';

export const quizRouter = {
    path: '/quiz',
    element: <QuizLayout />,
    errorElement: <Error />,
    children: [
        {
            index: true,
            element: <Quizzes />,
            loader: quizzesLoader,
        },
        {
            path: ':id',
            element: <Quiz />,
            loader: quizLoader,
        },
        {
            path: 'constructor',
            element: <QuizConstructor />,
        },
    ],
};
