import { useContext, useEffect, useState } from "react";
import { Stack, TextField, Button, Box } from "@mui/material";
import { ConstructorContext } from "../../context/quizConstructor";
import QuestionTemplate from "./template";

import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { create } from "../../http/quizApi";

const QuizConstructor  = () => {
  const [constructorState, dispatch] = useContext(ConstructorContext);
  
  const [title, setTitle] = useState('');

  const setQuestionsCount = (count) => {
    for (let i=0; i < count; i++) {
      dispatch({  type: 'ADD_QUESTION' })
    }
  };

  useEffect(() => dispatch({ type: 'SET_TITLE', payload: title }), [title, dispatch]);

  const saveQuiz = () => create(constructorState.questions, constructorState.title);

  return (
      <Box display="flex" flexDirection="column" justifyContent="center" gap="2rem">
        <Box display="flex" flexDirection="column" justifyContent="center" gap="1rem">
          <Stack direction="column" spacing={2}>
            <TextField 
            id="outlined-basic" 
            label="Quiz title" 
            variant="outlined" 
            onChange={(event) => setTitle(event.target.value)} 
            value={title}
            />
            <TextField 
            id="outlined-basic" 
            label="Questions amount" 
            variant="outlined" 
            type="number"
            onChange={(event) => setQuestionsCount(event.target.value)}
            />
          </Stack>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" gap="1rem">
          {constructorState.questions.length > 0  && 
          constructorState.questions.map((question, index) => <QuestionTemplate key={index} questionIndex={index} />)}
        </Box>
        <Button
            variant="contained"
            color="success"
            onClick={saveQuiz}
            endIcon={<SaveIcon />}>
            Save quiz
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={saveQuiz}
            endIcon={<DeleteForeverIcon />}>
            Delete quiz
          </Button>
      </Box>
  );
}

export default QuizConstructor;
