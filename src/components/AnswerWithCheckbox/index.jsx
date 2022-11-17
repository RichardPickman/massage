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
        answerId,
        addAnswer,
        handleCorrectAnswer,
        removeBlank,
        predefinedText,
        predefinedCheckbox,
    } = props;
    const [text, setText] = useState(predefinedText);
    const [checked, setChecked] = useState(predefinedCheckbox);

    const onChange = (text) => {
        if (text.target.value === '') {
            removeBlank();
        }

        setText(text.target.value);
        addAnswer(text.target.value, answerId);
    };

    const handleCorrect = () => {
        setChecked(!checked);
        handleCorrectAnswer(answerId);
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
    answerId: PropTypes.number,
    addAnswer: PropTypes.func,
    handleCorrectAnswer: PropTypes.func,
    removeBlank: PropTypes.func,
    predefinedText: PropTypes.string,
    predefinedCheckbox: PropTypes.bool,
};
