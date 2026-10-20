import { RequireAuth } from '../../components/RequireAuth';
import { Quiz, loader as quizLoader } from '../../pages/Quiz';
import { QuizConstructor } from '../../pages/QuizConstructor';
import { Quizzes, loader as quizzesLoader } from '../../pages/Quizzes';

export const quizRouter = [
    {
        path: 'quiz',
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
                element: (
                    <RequireAuth>
                        <QuizConstructor />
                    </RequireAuth>
                ),
            },
        ],
    },
];
