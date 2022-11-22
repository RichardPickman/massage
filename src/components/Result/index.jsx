import React, { useContext, useState } from 'react';
import { QuizContext } from '../../context/quiz';
import { Button, Stack, Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Question from '../Question';

const Result = () => {
    const [quizState, dispatch] = useContext(QuizContext);

    const [showWrong, setShowWrong] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showUnanswered, setShowUnanswered] = useState(false);

    const quiz = (snap) => {
        const currentQuestion = quizState.questions.find(
            (item) => item._id === snap.id
        );

        const questionData = {
            correctAnswers: currentQuestion.correctAnswers,
            currentAnswers: snap.currentAnswers,
            isFinished: true,
            showAnswers: false,
        };

        return (
            <Question
                currentState={questionData}
                currentQuestion={currentQuestion}
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
                    You&apos;ve got {quizState.currentAnswerCount} of{' '}
                    {quizState.questions.length} right
                </Typography>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={() => dispatch({ type: 'RESTART' })}
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
                        quizState.saveHistory
                            .filter((item) => item.currentAnswers.length === 0)
                            .map((snap, index) => quiz(snap, index))}

                    {showWrong &&
                        quizState.saveHistory
                            .filter((item) => {
                                const question = quizState.questions.find(
                                    (quest) => quest._id === item.id
                                );

                                return item.currentAnswers.some(
                                    (ans) =>
                                        !question.correctAnswers.includes(ans)
                                );
                            })
                            .map((snap, index) => quiz(snap, index))}

                    {!showWrong &&
                        !showUnanswered &&
                        quizState.saveHistory.map((snap, index) =>
                            quiz(snap, index)
                        )}
                </Box>
            </Box>
        </Box>
    );
};

export default Result;
