import React, { useState } from 'react';
import { Button, Stack, Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Question from '../Question';
import { useDispatch, useSelector } from 'react-redux';
import { restart } from '../../store/reducers/quiz';

const Result = () => {
    const quiz = useSelector((state) => state.quiz);
    const dispatch = useDispatch();

    const [showWrong, setShowWrong] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showUnanswered, setShowUnanswered] = useState(false);

    const question = (snap) => {
        return (
            <Question
                key={snap.id}
                currentState={{
                    ...quiz,
                    correctAnswers: quiz.currentQuestion.correctAnswers,
                    currentAnswers: snap.currentAnswers,
                    showAnswers: false,
                }}
                currentQuestion={quiz.currentQuestion}
                onSelect={() => {}}
            />
        );
    };

    return (
        <Box display="flex" flexDirection="column" gap="1rem">
            <Box
                display="flex"
                flexDirection="column"
                gap="1rem"
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="body1">
                    You&apos;ve got {quiz.currentAnswerCount} of{' '}
                    {quiz.questions.length} right
                </Typography>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={() => dispatch(restart({ ...quiz }))}
                >
                    {' '}
                    Restart{' '}
                </Button>
            </Box>
            <Box display="flex" flexDirection="column" gap="1rem">
                <Button
                    className="fold-answers"
                    onClick={() => setShowResults(!showResults)}
                >
                    {showResults ? 'Fold' : 'Unfold'}{' '}
                    {showResults ? (
                        <KeyboardArrowUpIcon />
                    ) : (
                        <KeyboardArrowDownIcon />
                    )}
                </Button>
                <Box
                    display={`${showResults ? 'flex' : 'none'}`}
                    flexDirection="column"
                    gap="1rem"
                    alignItems="center"
                >
                    <Stack direction="row" spacing={1}>
                        <Button
                            className="fold-answers"
                            variant={`${showWrong ? 'contained' : 'outlined'}`}
                            onClick={() => {
                                setShowWrong(!showWrong);
                                setShowUnanswered(false);
                            }}
                        >
                            Show wrong answers
                        </Button>
                        <Button
                            className="fold-answers"
                            variant={`${
                                showUnanswered ? 'contained' : 'outlined'
                            }`}
                            onClick={() => {
                                setShowUnanswered(!showUnanswered);
                                setShowWrong(false);
                            }}
                        >
                            Show unanswered
                        </Button>
                    </Stack>
                    {showUnanswered &&
                        quiz.history
                            .filter((item) => item.currentAnswers.length === 0)
                            .map((snap, index) => question(snap, index))}

                    {showWrong &&
                        quiz.history
                            .filter((item) => {
                                const question = quiz.questions.find(
                                    (quest) => quest._id === item.id
                                );

                                return item.currentAnswers.some(
                                    (ans) =>
                                        !question.correctAnswers.includes(ans)
                                );
                            })
                            .map((snap, index) => question(snap, index))}

                    {!showWrong &&
                        !showUnanswered &&
                        quiz.history.map((snap, index) =>
                            question(snap, index)
                        )}
                </Box>
            </Box>
        </Box>
    );
};

export default Result;
