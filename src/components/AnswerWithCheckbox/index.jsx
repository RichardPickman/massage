import {
    TextField,
    Checkbox,
    FormControlLabel,
    FormControl,
} from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';
import React from 'react';

const AnswerWithCheckbox = (props) => {
    const {
        answerIndex,
        addAnswer,
        handleCorrectAnswer,
        removeBlank,
        predefinedText,
        predefinedCheckbox,
    } = props;
    const [text, setText] = useState(predefinedText);
    const [checked, setChecked] = useState(predefinedCheckbox);

    const onChange = (event) => {
        if (event.target.value === '') {
            removeBlank();
        }

        setText(event.target.value);
        addAnswer(event.target.value, answerIndex);
    };

    const handleCorrect = () => {
        setChecked(!checked);
        handleCorrectAnswer(answerIndex);
    };

    return (
        <FormControl fullWidth>
            <TextField
                value={text}
                variant="filled"
                onChange={onChange}
            ></TextField>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={predefinedCheckbox}
                        onChange={handleCorrect}
                    />
                }
                label="Correct answer"
            />
        </FormControl>
    );
};

export default AnswerWithCheckbox;

AnswerWithCheckbox.propTypes = {
    answerIndex: PropTypes.number,
    addAnswer: PropTypes.func,
    handleCorrectAnswer: PropTypes.func,
    removeBlank: PropTypes.func,
    predefinedText: PropTypes.string,
    predefinedCheckbox: PropTypes.bool,
};
