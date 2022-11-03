import { useRef } from "react";
import { TextField, Checkbox, FormControlLabel, FormControl } from "@mui/material";

const AnswerWithCheckbox = (props) => {
  const { answerId,addAnswer,handleCorrectAnswer,addBlank } = props;
  
  const correct = useRef();
  const answer = useRef();

  return (
    <FormControl>
      <TextField variant="filled" onBlur={() => addAnswer(answer.current.value, answerId)} onChange={() => addBlank(answerId)} inputRef={answer}></TextField>
      <FormControlLabel control={<Checkbox inputRef={correct} onChange={() => handleCorrectAnswer(answerId)} />} label="Correct answer" />
    </FormControl>
  )
}

export default AnswerWithCheckbox;
