import { useLayoutEffect } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import QuizService from '../../services/Quiz';
import type { QuizSummary } from '../../services/models';
import { useAppDispatch, useAppSelector } from '../../store';
import { setQuizzes } from '../../store/reducers/quizzes';
import { QuizCard } from './components/Card';

interface QuizzesLoaderData {
    quizzes: QuizSummary[];
}

export const Quizzes = () => {
    const loaderData = useLoaderData() as QuizzesLoaderData;
    const quizzes = useAppSelector((state) => state.quizzes.quizzes);
    const { isAuth } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useLayoutEffect(() => {
        dispatch(setQuizzes(loaderData.quizzes));
    }, [dispatch, loaderData.quizzes]);

    return (
        <div>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <CardTitle>Quizzes</CardTitle>
                    <CardDescription>
                        Scored tests. Every attempt lands on your record.
                    </CardDescription>
                </div>
                {isAuth ? (
                    <Button asChild size="sm">
                        <Link to="constructor">Add quiz</Link>
                    </Button>
                ) : null}
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quizzes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        There is no quiz yet.
                    </p>
                ) : (
                    quizzes.map((quiz) => (
                        <QuizCard key={quiz._id} quiz={quiz} />
                    ))
                )}
            </CardContent>
        </div>
    );
};

export const loader = async () => {
    const { payload } = await QuizService.getAllQuizzes();

    return { quizzes: Array.isArray(payload) ? payload : [] };
};
