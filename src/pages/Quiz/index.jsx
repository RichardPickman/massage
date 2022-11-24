import React, { useContext, useState } from 'react';
import { QuizContext } from '../../context/quiz';
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

const Quiz = () => {
    const loaderData = useLoaderData();
    const [quizState, dispatch] = useContext(QuizContext);
    const [showAnswers, setShowAnswers] = useState(false);
    const buttonDisabled = quizState.currentQuestionIndex === 0;
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

    useLayoutEffect(
        () =>
            dispatch({
                type: 'SET_QUIZ',
                payload: loaderData,
            }),
        []
    );

    if (quizState.isFinished) {
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
            {quizState.questions.length === 0 ? (
                <CircularProgress />
            ) : (
                <Card>
                    <CardHeader
                        title={quizState.title}
                        subheader={`Question ${
                            quizState.currentQuestionIndex + 1
                        } / 
                        ${quizState.questions.length}`}
                    />
                    <CardContent>
                        <Question
                            currentState={{
                                ...quizState,
                                showAnswers: showAnswers,
                            }}
                            currentQuestion={currentQuestion}
                            onSelect={(id) =>
                                dispatch({
                                    type: 'SELECT_ANSWER',
                                    payload: { id },
                                })
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
                            onClick={() => dispatch({ type: 'PREV_QUESTION' })}
                        >
                            Previous question
                        </Button>
                        <ShowAnswers
                            showAnswersState={showAnswers}
                            onChange={() => setShowAnswers(!showAnswers)}
                        />
                        <Button
                            variant="contained"
                            onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
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
