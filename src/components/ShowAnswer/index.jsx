import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import PropTypes from 'prop-types';

const ShowAnswers = ({ showAnswersState, onChange }) => {
    return (
        <FormControlLabel
            control={<Switch />}
            label="Show answers"
            labelPlacement="bottom"
            onChange={() => onChange(!showAnswersState)}
            checked={showAnswersState}
        />
    );
};

export default ShowAnswers;

ShowAnswers.propTypes = {
    showAnswersState: PropTypes.bool,
    onChange: PropTypes.func,
};
