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
        id,
        addAnswer,
        handleCorrectAnswer,
        removeEmpty,
        predefinedText,
        predefinedCheckbox,
    } = props;

    const [text, setText] = useState(predefinedText);
    const [checked, setChecked] = useState(predefinedCheckbox);

    const onChange = (event) => {
        if (!event.target.value) {
            removeEmpty(id);
            setText(event.target.value);
        } else {
            addAnswer({ id: id, text: event.target.value });
            setText(event.target.value);
        }
    };

    const handleCorrect = () => {
        setChecked(!checked);
        handleCorrectAnswer(id);
    };

    return (
        <FormControl fullWidth>
            <TextField value={text} variant="filled" onChange={onChange} />
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
    id: PropTypes.string,
    addAnswer: PropTypes.func,
    handleCorrectAnswer: PropTypes.func,
    removeEmpty: PropTypes.func,
    predefinedText: PropTypes.string,
    predefinedCheckbox: PropTypes.bool,
};
