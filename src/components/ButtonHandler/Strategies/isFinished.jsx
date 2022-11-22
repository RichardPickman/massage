import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const IsFinished = ({ state }) => {
    const { currentAnswers, correctAnswers, answer } = state;
    const variant = currentAnswers.includes(answer.id)
        ? 'contained'
        : 'outlined';

    if (correctAnswers.includes(answer.id)) {
        return (
            <Button fullWidth variant={variant} color="success">
                {answer.text}
            </Button>
        );
    }
    if (
        !correctAnswers.includes(answer.id) &&
        currentAnswers.includes(answer.id)
    ) {
        return (
            <Button fullWidth variant={variant} color="error">
                {answer.text}
            </Button>
        );
    }

    if (!currentAnswers.includes(answer.id)) {
        return (
            <Button fullWidth variant="outlined" disabled>
                {answer.text}
            </Button>
        );
    }
};

export default IsFinished;

IsFinished.propTypes = {
    state: PropTypes.object,
};
