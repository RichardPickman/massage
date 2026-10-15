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
import RandomData from '../../services/RandomData';
import type { Beer, QuizSummary } from '../../services/models';
import { useAppDispatch, useAppSelector } from '../../store';
import { setQuizzes } from '../../store/reducers/quizzes';
import { QuizCard } from './components/Card';

interface QuizzesLoaderData {
    quizzes: QuizSummary[];
    beers: string[];
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
                    quizzes.map((quiz, index) => (
                        <QuizCard
                            key={quiz._id}
                            quiz={quiz}
                            fallbackAuthor={
                                loaderData.beers[index]
                                    ? loaderData.beers[index]
                                    : 'Anonymous'
                            }
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export const loader = async () => {
    const { payload } = await QuizService.getAllQuizzes();
    const quizzes = Array.isArray(payload) ? payload : [];
    const beer = await RandomData.getBeer(quizzes.length).catch(
        () => [] as Beer[]
    );

    return {
        quizzes,
        beers: Array.isArray(beer) ? beer.map((item) => item.style) : [],
    };
};

