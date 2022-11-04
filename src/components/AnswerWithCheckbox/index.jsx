import { useRef } from "react";
import { TextField, Checkbox, FormControlLabel, FormControl } from "@mui/material";
import { useCallback, useState } from "react";
import { useEffect } from "react";

const AnswerWithCheckbox = (props) => {
  const { 
    answerId,
    addAnswer,
    handleCorrectAnswer,
    addBlank,
    predefinedText,
    predefinedCheckbox 
  } = props;
  const [text, setText] = useState(predefinedText)
  const [checked, setChecked] = useState(predefinedCheckbox);
  
  // const onBlur = () => useCallback(() => addAnswer(text, answerId), [text]);
  // const onChange = () => useCallback(() => addBlank(answerId), [checked]);
  // const handleCorrect = () => useCallback(() => handleCorrectAnswer(answerId), [checked]);

  useEffect(() => addAnswer(text, answerId), [text])

  const onChange = (text) => {
    setText(text.target.value);
    addBlank(answerId);
  }

  const handleCorrect = () => {
    setChecked(checked);
    handleCorrectAnswer(answerId);
  }

  return (
    <FormControl fullWidth>
      <TextField value={predefinedText} variant="filled" onChange={onChange}></TextField>
      <FormControlLabel control={<Checkbox checked={predefinedCheckbox} onChange={handleCorrect} />} label="Correct answer" />
    </FormControl>
  )
}

export default AnswerWithCheckbox;
