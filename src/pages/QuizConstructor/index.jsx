import QuestionTemplate from "./template";
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { useState } from "react";
import { Stack, TextField, Button, Box, CircularProgress } from "@mui/material";
import { create } from "../../http/quizApi";
import { memo } from "react";
import { useCallback } from "react";
import { useMemo } from "react";

const questionTemp = {
  question: "",
  img: "",
  answers: [''],
  correctAnswers: [],
  isPreview: false,
}

const QuizConstructor  = () => {
  const [questionsLoading, setQuestionsLoading] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');

  const deleteQuiz = useCallback(() => setQuestions([]), [setQuestions]);
  const saveQuiz = () => create(questions, title);

  const updateQuestion = useCallback((data) => {
    setQuestions((prevValue) => {
      return prevValue.map((item) => item.id === data.id ? { ...data } : item);
    })
  }, []);

  const removeQuestion = useCallback((id) => {
    setQuestions((prevValue) => {
      return prevValue.filter((item) => item.id !== id);
    })
  }, []);

  const setQuestionsCount = (amount) => {
    setQuestionsLoading(true);

    const questions = [];

    for (let i = 0; i < amount; i++) {
      questions.push({ id: i, ...questionTemp });
    }

    setQuestions(questions);

    setQuestionsLoading(false);
  };

  if (questionsLoading) {
    return <CircularProgress />
  }

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
            inputProps={{ min: 1, max: 100 }}
            onChange={(event) => setQuestionsCount(event.target.value)}
          />
        </Stack>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" gap="1rem">
        {questions.map((item) => {
          return (
            <QuestionTemplate 
              questionData={item}
              key={item.id}
              removeQuestion={removeQuestion} 
              updateQuestion={updateQuestion} 
              questionId={item.id}
              isPreview={item.isPreview}
            />)
        })}
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
        onClick={deleteQuiz}
        endIcon={<DeleteForeverIcon />}>
        Delete quiz
      </Button>
    </Box>
  )
}

export default memo(QuizConstructor);
