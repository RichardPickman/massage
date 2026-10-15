import { useLayoutEffect, useState } from 'react';
import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import { Question } from '../../components/Question';
import { Result } from '../../components/Result';
import { ShowAnswers } from '../../components/ShowAnswer';
import { Button } from '../../components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import QuizService from '../../services/Quiz';
import type { Quiz as QuizModel } from '../../services/models';
import { useAppDispatch, useAppSelector } from '../../store';
import {
    nextQuestion,
    prevQuestion,
    selectQuestion,
    setQuiz,
} from '../../store/reducers/quiz';

export const Quiz = () => {
    const loaderData = useLoaderData() as QuizModel;
    const quiz = useAppSelector((state) => state.quiz);
    const dispatch = useAppDispatch();

    const [showAnswers, setShowAnswers] = useState(false);

    useLayoutEffect(() => {
        dispatch(setQuiz(loaderData));
    }, [dispatch, loaderData]);

    if (quiz.questions.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    This quiz has no questions yet.
                </CardContent>
            </Card>
        );
    }

    if (quiz.isFinished) {
        return <Result />;
    }

    const currentQuestion = quiz.currentQuestion;

    if (!currentQuestion) {
        return null;
    }

    const isLastQuestion =
        quiz.currentQuestionIndex === quiz.questions.length - 1;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                    Question {quiz.currentQuestionIndex + 1} /{' '}
                    {quiz.questions.length}
                </p>
            </CardHeader>
            <CardContent>
                <Question
                    currentQuestion={currentQuestion}
                    currentState={{ ...quiz, showAnswers }}
                    onSelect={(id) => dispatch(selectQuestion({ id }))}
                />
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-2 px-6">
                <Button
                    variant="outline"
                    disabled={quiz.currentQuestionIndex === 0}
                    onClick={() => dispatch(prevQuestion())}
                >
                    Previous question
                </Button>
                <ShowAnswers
                    showAnswersState={showAnswers}
                    onChange={() => setShowAnswers(!showAnswers)}
                />
                <Button
                    variant="outline"
                    onClick={() => dispatch(nextQuestion())}
                >
                    {isLastQuestion ? 'Finish' : 'Next question'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const quizId = params.id;

    if (!quizId) {
        throw new Error('Quiz id is missing');
    }

    const { payload } = await QuizService.getQuiz(quizId);

    return payload;
};

