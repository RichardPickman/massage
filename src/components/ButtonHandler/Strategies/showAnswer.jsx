import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const ShowAnswer = ({ state }) => {
    if (state.correctAnswers.includes(state.answer.id)) {
        return (
            <Button fullWidth variant="outlined" color="success">
                {state.answer.text}
            </Button>
        );
    }

    return (
        <Button fullWidth variant="outlined" disabled>
            {state.answer.text}
        </Button>
    );
};

export default ShowAnswer;

ShowAnswer.propTypes = {
    state: PropTypes.object,
};
