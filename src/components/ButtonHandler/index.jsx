import React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import ShowAnswer from './Strategies/showAnswer';
import IsFinished from './Strategies/isFinished';

const ButtonHandler = ({ state }) => {
    const { isFinished, showAnswers, answer, currentAnswers, onSelect } = state;

    if (showAnswers) {
        return <ShowAnswer state={state} />;
    }

    if (isFinished) {
        return <IsFinished state={state} />;
    }

    const answered = currentAnswers.includes(answer.id)
        ? 'contained'
        : 'outlined';

    return (
        <Button
            fullWidth
            variant={answered}
            onClick={() => onSelect(answer.id)}
        >
            {answer.text}
        </Button>
    );
};

export default ButtonHandler;

ButtonHandler.propTypes = {
    showAnswers: PropTypes.bool,
    isFinished: PropTypes.bool,
    state: PropTypes.object,
};
