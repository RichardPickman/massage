import { useContext, useEffect, useState } from "react";
import { Stack, TextField, Button, Box } from "@mui/material";
import { ConstructorContext } from "../../context/quizConstructor";
import { templateWithKey } from "./helpers";

const QuizConstructor  = () => {
  const [constructorState, dispatch] = useContext(ConstructorContext);
  
  const [title, setTitle] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [blockRender, setBlockRender] = useState(true);
  const [questionNumber, setQuestionNumber] = useState(0);

  const renderQuestions = () => setQuestions(templateWithKey(questionNumber));
  const clearQuestions = () => setQuestions([]);
  
  useEffect(() => Number(questionNumber) ? setBlockRender(false) : setBlockRender(true), [questionNumber]);

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" gap="2rem">
      <Box display="flex" flexDirection="column" justifyContent="center" gap="1rem">
        <Stack direction="column" spacing={2}>
          <TextField 
          id="outlined-basic" 
          label="Quiz title" 
          variant="outlined" 
          onChange={(event) => setTitle(event.target.value)} 
          />
          <TextField 
          id="outlined-basic" 
          label="Questions amount" 
          variant="outlined" 
          type="number"
          onChange={(event) => setQuestionNumber(Number(event.target.value))}
          />
        </Stack>
      </Box>
      <Box display="flex" justifyContent="center" gap="1rem" direction="row" spacing={2}>
        <Button variant="contained" disabled={blockRender} onClick={renderQuestions} >Render</Button>
        <Button variant="contained" onClick={clearQuestions} >Clear</Button>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" gap="1rem">
        {questions}
      </Box>
    </Box>
  );
}

export default QuizConstructor;
