import React, { useContext, useEffect, useState } from 'react';
import { QuizContext } from '../../context/quiz';
import Question from '../../components/Question';
import Result from '../../components/Result';
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Stack,
    Typography,
    CardHeader,
    CardActions,
    CardContent,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getQuiz } from '../../http/quizApi';
import ShowAnswers from '../../components/ShowAnswer';
import { useCallback } from 'react';

const Quiz = () => {
    const { id } = useParams();
    const [quizState, dispatch] = useContext(QuizContext);
    const [showAnswers, setShowAnswers] = useState(false);
    const buttonDisabled = quizState.currentQuestionIndex === 0;
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const { data } = await getQuiz(id);
                dispatch({ type: 'SET_QUIZ', payload: data.payload });
            } catch (e) {
                console.log(e.message);
            }
        };

        fetchQuiz();
    }, []);

    const nextQuestion = useCallback(
        () => dispatch({ type: 'NEXT_QUESTION' }),
        [dispatch]
    );
    const prevQuestion = useCallback(
        () => dispatch({ type: 'PREV_QUESTION' }),
        [dispatch]
    );

    const toggleQuestion = useCallback((state) => setShowAnswers(state), []);

    if (quizState.showResults) {
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
                    >
                        <Typography variant="body1">{}</Typography>
                        <Typography variant="body1"></Typography>
                    </CardHeader>
                    <CardContent>
                        <Question
                            currentState={{
                                ...quizState,
                                showAnswers: showAnswers,
                                onSelectAnswer: (answerIndex) =>
                                    dispatch({
                                        type: 'SELECT_ANSWER',
                                        payload: { answerIndex },
                                    }),
                            }}
                            currentQuestion={currentQuestion}
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
                            onClick={prevQuestion}
                        >
                            Previous question
                        </Button>
                        <ShowAnswers
                            showAnswersState={showAnswers}
                            onChange={toggleQuestion}
                        />
                        <Button variant="contained" onClick={nextQuestion}>
                            Next question
                        </Button>
                    </CardActions>
                </Card>
            )}
        </Box>
    );
};

export default Quiz;
