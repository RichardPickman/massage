import { useContext, useRef, useState } from "react";
import { TextField, Box, Checkbox, Input, FormControlLabel, FormControl } from "@mui/material";
import { ConstructorContext } from "../../context/quizConstructor";

const AnswerWithCheckbox = ({ questionIndex, answerId }) => {
  const [constructorState, dispatch] = useContext(ConstructorContext);
  
  const correct = useRef();
  const answer = useRef();

  const saveAnswer = () => dispatch({ type: 'ADD_ANSWER', payload: {  questionIndex,  currentAnswer: answer.current.value,  answerId }});

  const saveCorrect = () => dispatch({ type: 'ADD_CORRECT_ANSWER',  payload: { questionIndex,  currentAnswer: answer.current.value }});

  const removeCorrect = () => dispatch({ type: 'REMOVE_CORRECT_ANSWER',  payload: { questionIndex,  currentAnswer: answer.current.value }});

  const addTextbox = () => dispatch({ type: 'ADD_BLANK_ANSWER', payload: { questionIndex,  answerId }});

  const handleCheck = () => correct.current.checked ? saveCorrect() : removeCorrect();

  return (
    <FormControl>
      <Input variant="outlined" onBlur={saveAnswer} onChange={addTextbox} inputRef={answer}></Input>
      <FormControlLabel control={<Checkbox inputRef={correct} onChange={() => handleCheck()} />} label="Correct answer" />
    </FormControl>
  )
}

export default AnswerWithCheckbox;
