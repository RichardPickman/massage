import React, { useState } from 'react';
import Question from '../../components/Question';
import Result from '../../components/Result';
import {
    Box,
    Button,
    Card,
    CircularProgress,
    CardHeader,
    CardActions,
    CardContent,
} from '@mui/material';
import { useLoaderData } from 'react-router-dom';

import QuizService from '../../services/Quiz';
import ShowAnswers from '../../components/ShowAnswer';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setQuiz,
    prevQuestion,
    nextQuestion,
    selectQuestion,
} from '../../store/reducers/quiz';

const Quiz = () => {
    const loaderData = useLoaderData();

    const quiz = useSelector((state) => state.quiz);
    const dispatch = useDispatch();

    const [showAnswers, setShowAnswers] = useState(false);
    const buttonDisabled = quiz.currentQuestionIndex === 0;

    useLayoutEffect(() => {
        dispatch(setQuiz(loaderData));
    }, []);

    if (quiz.isFinished) {
        return <Result />;
    }

    return (
        <Box
            display="flex"
            sx={{ width: '100%' }}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="1rem"
        >
            {quiz.questions.length === 0 ? (
                <CircularProgress />
            ) : (
                <Card>
                    <CardHeader
                        title={quiz.title}
                        subheader={`Question ${quiz.currentQuestionIndex + 1} / 
                        ${quiz.questions.length}`}
                    />
                    <CardContent>
                        <Question
                            currentState={{
                                ...quiz,
                                showAnswers: showAnswers,
                            }}
                            currentQuestion={quiz.currentQuestion}
                            onSelect={(id) =>
                                dispatch(selectQuestion({ id: id }))
                            }
                        />
                    </CardContent>
                    <CardActions
                        sx={{
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Button
                            variant="contained"
                            disabled={buttonDisabled}
                            onClick={() => dispatch(prevQuestion())}
                        >
                            Previous question
                        </Button>
                        <ShowAnswers
                            showAnswersState={showAnswers}
                            onChange={() => setShowAnswers(!showAnswers)}
                        />
                        <Button
                            variant="contained"
                            onClick={() => dispatch(nextQuestion())}
                        >
                            Next question
                        </Button>
                    </CardActions>
                </Card>
            )}
        </Box>
    );
};

export const loader = async ({ params }) => {
    const quizId = params.id;
    const { payload } = await QuizService.getQuiz(quizId);

    return payload;
};

export default Quiz;
