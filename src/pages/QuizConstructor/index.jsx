import { useContext, useRef, useState } from "react";
import { Stack, TextField, Button, Box } from "@mui/material";
import { ConstructorContext } from "../../context/quizConstructor";
import { questionTemplate } from "./templates";

const QuizConstructor  = () => {
  const [constructorState, dispatch] = useContext(ConstructorContext);
  const [questions, setQuestions] = useState([]);

  const title = useRef();
  const questionAmount = useRef();

  const renderQuestions = () => setQuestions([].fill(questionTemplate, 0, questionAmount.current.innerText - 1));
  const clearQuestions = () => setQuestions([]);

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" gap="2rem">
      <Box display="flex" flexDirection="column" justifyContent="center" gap="1rem">
        <Stack direction="column" spacing={2}>
          <TextField id="outlined-basic" label="Quiz title" variant="outlined" ref={title} type="text" />
          <TextField id="outlined-basic" label="Questions amount" variant="outlined" ref={questionAmount} type="text" />
        </Stack>
        <Box display="flex" justifyContent="center" gap="1rem" direction="row" spacing={2}>
          <Button variant="contained" onClick={renderQuestions} > Render </Button>
          <Button variant="contained" onClick={clearQuestions} > Clear </Button>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" gap="1rem">
        {questions}
      </Box>
    </Box>
  );
}

export default QuizConstructor;
