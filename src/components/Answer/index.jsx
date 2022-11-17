import React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

const Answer = ({ answerProps }) => {
    const {
        answerText,
        index,
        onSelectAnswer,
        currentAnswers,
        correctAnswers,
        showAnswers,
        isFinished,
    } = answerProps;

    const answered = currentAnswers.includes(index) ? 'contained' : 'outlined';

    if (showAnswers) {
        if (correctAnswers.includes(index)) {
            return (
                <Button fullWidth variant="outlined" color="success">
                    {answerText}
                </Button>
            );
        }
        if (!correctAnswers.includes(index)) {
            return (
                <Button fullWidth variant="outlined" disabled>
                    {answerText}
                </Button>
            );
        }
    }

    if (isFinished) {
        if (correctAnswers.includes(index)) {
            return (
                <Button
                    fullWidth
                    variant={
                        currentAnswers.includes(index)
                            ? 'contained'
                            : 'outlined'
                    }
                    color="success"
                >
                    {answerText}
                </Button>
            );
        }
        if (!correctAnswers.includes(index) && currentAnswers.includes(index)) {
            return (
                <Button
                    fullWidth
                    variant={
                        currentAnswers.includes(index)
                            ? 'contained'
                            : 'outlined'
                    }
                    color="error"
                >
                    {answerText}
                </Button>
            );
        }

        if (!currentAnswers.includes(index)) {
            return (
                <Button fullWidth variant="outlined" disabled>
                    {answerText}
                </Button>
            );
        }
    }

    return (
        <Button
            fullWidth
            variant={answered}
            onClick={() => onSelectAnswer(index)}
        >
            {answerText}
        </Button>
    );
};

export default Answer;

Answer.propTypes = {
    answerProps: PropTypes.object,
};
