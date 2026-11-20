import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { QuestionResult } from '../../services/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { buildAnswers } from '../../store/reducers/helpers';
import {
    fetchQuizStats,
    restart,
    submitAttempt,
} from '../../store/reducers/quiz';
import { Question } from '../Question';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

interface ReviewItem {
    id: string;
    currentAnswers: string[];
    questionText?: string;
    answers?: { id: string; text: string }[];
    correctAnswers?: string[];
    correct?: boolean;
}

interface ResultProps {
    quizId: string;
}

export const Result = ({ quizId }: ResultProps) => {
    const quiz = useAppSelector((state) => state.quiz);
    const { isAuth, isRestoringSession } = useAppSelector(
        (state) => state.auth
    );
    const dispatch = useAppDispatch();

    const [showWrong, setShowWrong] = useState(false);
    const [showUnanswered, setShowUnanswered] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const { submission, stats, isFetchingStats, statsError } = quiz;

    // Refetched once the submission lands, so the attempt just made counts.
    // Signed-out visitors are never asked: there is nothing to summarise.
    useEffect(() => {
        if (!submission || !isAuth) {
            return;
        }

        dispatch(fetchQuizStats(quizId));
    }, [dispatch, quizId, submission, isAuth]);

    const handleStatsRetry = () => {
        dispatch(fetchQuizStats(quizId));
    };

    // The first render after the submission happens before the effect can
    // dispatch, so that gap reads as loading rather than as missing stats.
    const isStatsLoading =
        isRestoringSession ||
        isFetchingStats ||
        (isAuth && !stats && !statsError);

    const resultFor = (questionId: string): QuestionResult | undefined =>
        submission?.results.find((result) => result.questionId === questionId);

    const renderQuestion = (item: ReviewItem) => {
        const snapshot = resultFor(item.id);
        const liveQuestion = quiz.questions.find(
            (question) => question._id === item.id
        );

        // A question deleted from the quiz must not make the review vanish: the
        // snapshot is the only remaining record of what was asked.
        const currentQuestion = liveQuestion
            ? {
                  ...liveQuestion,
                  // Prefer the snapshot even while the question exists, so an
                  // edit made after the attempt cannot rewrite the review.
                  question:
                      item.questionText ||
                      snapshot?.questionText ||
                      liveQuestion.question,
                  answers: item.answers?.length
                      ? item.answers
                      : snapshot?.answers?.length
                      ? snapshot.answers
                      : liveQuestion.answers,
              }
            : item.questionText || snapshot?.questionText
            ? {
                  _id: item.id,
                  question: item.questionText ?? snapshot?.questionText ?? '',
                  answers: item.answers ?? snapshot?.answers ?? [],
                  correctAnswers: snapshot?.correctAnswers ?? [],
                  img: null,
              }
            : null;

        if (!currentQuestion) {
            return null;
        }

        const correctAnswers =
            item.correctAnswers ??
            snapshot?.correctAnswers ??
            currentQuestion.correctAnswers ??
            [];

        return (
            <Question
                key={item.id}
                currentQuestion={currentQuestion}
                currentState={{
                    correctAnswers,
                    currentAnswers: item.currentAnswers,
                    isFinished: true,
                    showAnswers: false,
                }}
                onSelect={() => {}}
            />
        );
    };

    // The attempt is the source of truth for the review: quiz.history only
    // exists while the tab stays open, and the server snapshot survives edits,
    // deletions and reloads.
    const attemptAnswers = submission?.attempt.answers ?? [];

    const reviewItems: ReviewItem[] = attemptAnswers.length
        ? attemptAnswers.map((answer) => ({
              id: String(answer.question),
              currentAnswers: Array.isArray(answer.selected)
                  ? answer.selected
                  : [],
              questionText: answer.questionText,
              answers: answer.answers,
              correct: answer.correct,
          }))
        : quiz.history.map((snap) => ({
              id: snap.id,
              currentAnswers: snap.currentAnswers,
          }));

    const wrongAnswers = reviewItems.filter((item) => {
        const result = resultFor(item.id);
        const isWrong =
            typeof item.correct === 'boolean'
                ? !item.correct
                : Boolean(result && !result.correct);

        return isWrong && item.currentAnswers.length > 0;
    });

    const unanswered = reviewItems.filter(
        (item) => item.currentAnswers.length === 0
    );

    const visibleHistory = showWrong
        ? wrongAnswers
        : showUnanswered
        ? unanswered
        : reviewItems;

    const handleShowWrong = () => {
        setShowWrong(!showWrong);
        setShowUnanswered(false);
    };

    const handleShowUnanswered = () => {
        setShowUnanswered(!showUnanswered);
        setShowWrong(false);
    };

    const handleRetry = () => {
        dispatch(submitAttempt({ quizId, answers: buildAnswers(quiz) }));
    };

    // The score is the server's answer, so there is nothing to render until it
    // arrives - and a failed request must be retryable, not a silent zero.
    if (!submission) {
        return (
            <Card className="mx-auto w-full max-w-3xl">
                <CardContent className="flex flex-col items-center gap-4 py-6">
                    {quiz.submitError ? (
                        <>
                            <p className="text-destructive">
                                {quiz.submitError}
                            </p>
                            <Button variant="outline" onClick={handleRetry}>
                                Try again
                            </Button>
                        </>
                    ) : (
                        <p className="text-muted-foreground">
                            Checking your answers...
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mx-auto w-full max-w-3xl">
            <CardContent className="flex flex-col items-center gap-4 py-6">
                <div className="flex flex-col items-center gap-1">
                    <p className="text-lg">
                        You&apos;ve got {submission.correctCount} of{' '}
                        {submission.questionCount} right
                        <span className="text-muted-foreground">
                            {' '}
                            ({submission.percent}%)
                        </span>
                    </p>
                    {submission.threshold === null ||
                    submission.threshold === undefined ? (
                        <p className="text-sm text-muted-foreground">
                            This quiz has no pass mark.
                        </p>
                    ) : (
                        <div className="flex flex-col items-center gap-1">
                            <span
                                className={
                                    submission.passed
                                        ? 'rounded-full bg-emerald-100 px-3 py-0.5 text-sm font-medium text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100'
                                        : 'rounded-full bg-destructive/10 px-3 py-0.5 text-sm font-medium text-destructive'
                                }
                            >
                                {submission.passed ? 'Passed' : 'Not passed'}
                            </span>
                            <p className="text-xs text-muted-foreground">
                                Pass mark {submission.threshold}%
                            </p>
                        </div>
                    )}
                </div>
                {!isAuth && !isRestoringSession ? (
                    <Alert className="w-full max-w-md">
                        <div className="flex flex-col gap-2">
                            <AlertTitle>
                                Your stats are behind sign-in
                            </AlertTitle>
                            <AlertDescription>
                                Sign in to see how many attempts you have made
                                and what your best score is.
                            </AlertDescription>
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="self-start"
                            >
                                <Link to="/auth/login">Sign in</Link>
                            </Button>
                        </div>
                    </Alert>
                ) : isStatsLoading ? (
                    <div
                        role="status"
                        className="flex w-full max-w-md flex-col items-center gap-2 py-1"
                    >
                        <Skeleton className="h-4 w-64" />
                        <span className="sr-only">Loading your stats...</span>
                    </div>
                ) : statsError ? (
                    <Alert variant="destructive" className="w-full max-w-md">
                        <div className="flex flex-col gap-2">
                            <AlertTitle>Could not load your stats</AlertTitle>
                            <AlertDescription className="text-destructive">
                                {statsError}
                            </AlertDescription>
                            <Button
                                size="sm"
                                variant="outline"
                                className="self-start"
                                onClick={handleStatsRetry}
                            >
                                Try again
                            </Button>
                        </div>
                    </Alert>
                ) : stats ? (
                    <p className="text-sm text-muted-foreground">
                        Attempt {stats.count} · best {stats.best}% · average{' '}
                        {stats.average}%
                    </p>
                ) : null}
                <Button
                    onClick={() =>
                        dispatch(
                            restart({
                                questions: quiz.questions,
                                title: quiz.title,
                            })
                        )
                    }
                >
                    Restart
                </Button>
            </CardContent>
            <CardContent className="flex flex-col gap-4">
                <Button
                    variant="outline"
                    className="self-start"
                    onClick={() => setShowResults(!showResults)}
                >
                    {showResults ? 'Fold' : 'Unfold'}
                    {showResults ? <CaretUpIcon /> : <CaretDownIcon />}
                </Button>
                {showResults ? (
                    <>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={showWrong ? 'default' : 'outline'}
                                onClick={handleShowWrong}
                            >
                                Show wrong answers
                            </Button>
                            <Button
                                variant={showUnanswered ? 'default' : 'outline'}
                                onClick={handleShowUnanswered}
                            >
                                Show unanswered
                            </Button>
                        </div>
                        <div className="flex flex-col gap-6">
                            {visibleHistory.length === 0 ? (
                                <p className="text-muted-foreground">
                                    Nothing to show here.
                                </p>
                            ) : (
                                visibleHistory.map(renderQuestion)
                            )}
                        </div>
                    </>
                ) : null}
            </CardContent>
        </Card>
    );
};
