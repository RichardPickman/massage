import { useLayoutEffect } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import {
    Card,
    CardContent,
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
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quizzes</CardTitle>
                {isAuth ? (
                    <Button asChild size="sm">
                        <Link to="constructor">Add quiz</Link>
                    </Button>
                ) : null}
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                {quizzes.length === 0 ? (
                    <p className="text-muted-foreground">
                        There is no quiz yet.
                    </p>
                ) : (
                    quizzes.map((quiz) => (
                        <QuizCard key={quiz._id} quiz={quiz} />
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export const loader = async () => {
    const { payload } = await QuizService.getAllQuizzes();

    return { quizzes: Array.isArray(payload) ? payload : [] };
};

