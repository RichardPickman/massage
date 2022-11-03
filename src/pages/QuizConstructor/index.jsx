import { memo, useContext, useEffect, useState } from "react";
import { Stack, TextField, Button, Box, CircularProgress } from "@mui/material";
import { ConstructorContext } from "../../context/quizConstructor";
import QuestionTemplate from "./template";

import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { create } from "../../http/quizApi";

const questionTemp = {
  question: "",
  img: "",
  answers: [''],
  correctAnswers: [],
  isSaved: false,
}

const QuizConstructor  = () => {
  const [questionsLoading, setQuestionsLoading] = useState(0);
  const [questions, setQuestions] = useState([]);
  
  const [title, setTitle] = useState('');

  const setQuestionsCount = async (amount) => {
    setQuestionsLoading(true);

    const result = [];

    for (let i=0; i < amount; i++) {
      const temp = { ...questionTemp, id: i };

      result.push(temp);
    }

    setQuestions(result);

    setQuestionsLoading(false);
  };

  const updateQuestion = (questionId, data) => {
    setQuestions(currQuestions => {
      return currQuestions.map((question) => {
        if (questionId === question._id) {
          return {
            ...questions, data
          }
        }

        return question;
      })
    })
  }

  const saveQuiz = () => create(questions, title);

  return questionsLoading ? 
    <CircularProgress /> : 
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
      {questions.map((item, index) => <QuestionTemplate key={item.id} questions={questions} updateQuestion={updateQuestion} questionId={index} />)}
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
}

export default QuizConstructor;
