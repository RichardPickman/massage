import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { Question } from '../../components/Question';
import { Result } from '../../components/Result';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import QuizService from '../../services/Quiz';
import type { Quiz as QuizModel } from '../../services/models';
import { useAppDispatch, useAppSelector } from '../../store';
import { buildAnswers } from '../../store/reducers/helpers';
import { QuizHeader } from './components/QuizHeader';
import {
    nextQuestion,
    prevQuestion,
    selectQuestion,
    setQuiz,
    submitAttempt,
} from '../../store/reducers/quiz';

export const Quiz = () => {
    const { t } = useTranslation();
    const loaderData = useLoaderData() as QuizModel;
    const quiz = useAppSelector((state) => state.quiz);
    const dispatch = useAppDispatch();

    const quizId = loaderData._id;

    useLayoutEffect(() => {
        dispatch(setQuiz(loaderData));
    }, [dispatch, loaderData]);

    if (quiz.questions.length === 0) {
        return (
            <div className="flex flex-1 flex-col gap-6">
                <PageHeader
                    back={{ to: '/quiz', label: t('quizzes.backAll') }}
                    title={quiz.title}
                    description={t('quizzes.emptyQuestions')}
                />
            </div>
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
        <div className="flex flex-1 flex-col gap-3">
            <QuizHeader
                title={quiz.title}
                current={quiz.currentQuestionIndex + 1}
                total={quiz.questions.length}
            />

            {/* The card is the question, not the page: the header and the controls
                sit on the page itself, as on every other screen. */}
            <Card className="flex flex-1 flex-col">
                <CardContent className="flex flex-1 flex-col">
                    <Question
                        currentQuestion={currentQuestion}
                        currentState={{ ...quiz, showAnswers: false }}
                        onSelect={(id) => dispatch(selectQuestion({ id }))}
                    />
                </CardContent>
            </Card>

            {/* Two words, one line: "Previous question / Next question" made the
                two buttons different widths and set them at different heights. */}
            <div className="flex items-center justify-between gap-2">
                <Button
                    variant="outline"
                    disabled={quiz.currentQuestionIndex === 0}
                    onClick={() => dispatch(prevQuestion())}
                >
                    {t('quiz.previous')}
                </Button>
                <Button onClick={handleNext}>
                    {isLastQuestion ? t('quiz.finish') : t('quiz.next')}
                </Button>
            </div>
        </div>
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
