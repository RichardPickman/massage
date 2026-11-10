import { useLayoutEffect } from 'react';
import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import { Question } from '../../components/Question';
import { Result } from '../../components/Result';
import { Button } from '../../components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import QuizService from '../../services/Quiz';
import type { Quiz as QuizModel } from '../../services/models';
import { useAppDispatch, useAppSelector } from '../../store';
import { buildAnswers } from '../../store/reducers/helpers';
import {
    nextQuestion,
    prevQuestion,
    selectQuestion,
    setQuiz,
    submitAttempt,
} from '../../store/reducers/quiz';

export const Quiz = () => {
    const loaderData = useLoaderData() as QuizModel;
    const quiz = useAppSelector((state) => state.quiz);
    const dispatch = useAppDispatch();

    const quizId = loaderData._id;

    useLayoutEffect(() => {
        dispatch(setQuiz(loaderData));
    }, [dispatch, loaderData]);

    if (quiz.questions.length === 0) {
        return (
            <Card className="mx-auto w-full max-w-3xl">
                <CardContent className="py-8 text-center text-muted-foreground">
                    This quiz has no questions yet.
                </CardContent>
            </Card>
        );
    }

    if (quiz.isFinished) {
        return <Result quizId={quizId} />;
    }

    const currentQuestion = quiz.currentQuestion;

    if (!currentQuestion) {
        return null;
    }

    const isLastQuestion =
        quiz.currentQuestionIndex === quiz.questions.length - 1;

    // The last click is also the submission: the answers go to the server,
    // which decides the score, and only then does the result view open.
    const handleNext = () => {
        if (isLastQuestion) {
            dispatch(submitAttempt({ quizId, answers: buildAnswers(quiz) }));
        }

        dispatch(nextQuestion());
    };

    return (
        <Card className="mx-auto w-full max-w-3xl">
            <CardHeader className="border-b">
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <CardTitle>{quiz.title}</CardTitle>
                    <p className="text-xs tracking-widest text-muted-foreground uppercase">
                        Question {quiz.currentQuestionIndex + 1} /{' '}
                        {quiz.questions.length}
                    </p>
                </div>
                <Progress
                    value={
                        ((quiz.currentQuestionIndex + 1) /
                            quiz.questions.length) *
                        100
                    }
                    className="mt-2 h-1"
                />
            </CardHeader>
            <CardContent>
                <Question
                    currentQuestion={currentQuestion}
                    currentState={{ ...quiz, showAnswers: false }}
                    onSelect={(id) => dispatch(selectQuestion({ id }))}
                />
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                <Button
                    variant="outline"
                    disabled={quiz.currentQuestionIndex === 0}
                    onClick={() => dispatch(prevQuestion())}
                >
                    Previous question
                </Button>
                <Button onClick={handleNext}>
                    {isLastQuestion ? 'Finish test' : 'Next question'}
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
