import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import type { AnswerHistory } from '../../store/reducers/helpers';
import { useAppDispatch, useAppSelector } from '../../store';
import { restart } from '../../store/reducers/quiz';
import { Question } from '../Question';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export const Result = () => {
    const quiz = useAppSelector((state) => state.quiz);
    const dispatch = useAppDispatch();

    const [showWrong, setShowWrong] = useState(false);
    const [showUnanswered, setShowUnanswered] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const renderQuestion = (snap: AnswerHistory) => {
        const currentQuestion = quiz.questions.find(
            (item) => item._id === snap.id
        );

        if (!currentQuestion) {
            return null;
        }

        return (
            <Question
                key={snap.id}
                currentQuestion={currentQuestion}
                currentState={{
                    correctAnswers: currentQuestion.correctAnswers,
                    currentAnswers: snap.currentAnswers,
                    isFinished: true,
                    showAnswers: false,
                }}
                onSelect={() => {}}
            />
        );
    };

    const wrongAnswers = quiz.history.filter((snap) => {
        const question = quiz.questions.find((item) => item._id === snap.id);

        if (!question) {
            return false;
        }

        return snap.currentAnswers.some(
            (answerId) => !question.correctAnswers.includes(answerId)
        );
    });

    const unanswered = quiz.history.filter(
        (snap) => snap.currentAnswers.length === 0
    );

    const visibleHistory = showWrong
        ? wrongAnswers
        : showUnanswered
          ? unanswered
          : quiz.history;

    const handleShowWrong = () => {
        setShowWrong(!showWrong);
        setShowUnanswered(false);
    };

    const handleShowUnanswered = () => {
        setShowUnanswered(!showUnanswered);
        setShowWrong(false);
    };

    return (
        <Card>
            <CardContent className="flex flex-col items-center gap-4 py-6">
                <p className="text-lg">
                    You&apos;ve got {quiz.currentAnswerCount.toFixed(1)} of{' '}
                    {quiz.questions.length} right
                </p>
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

