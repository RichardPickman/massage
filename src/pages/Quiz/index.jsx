import { useContext, useEffect, useState } from "react";
import { QuizContext } from "../../context/quiz";
import Question from "../../components/Question";
import Result from "../../components/Result";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { get } from "../../http/quizApi";
import ShowAnswers from "../../components/ShowAnswer";
import { memo } from "react";
import { useCallback } from "react";


const Quiz = () => {
  const { id } = useParams();
  const [quizState, dispatch] = useContext(QuizContext);
  const [showAnswers, setShowAnswers] = useState(false);
  const buttonDisabled = quizState.currentQuestionIndex === 0;

  const fetchQuiz = async () => {
    try {
      const data = await get(id);
      // console.log("Fetching data...");
      dispatch({ type: "SET_QUIZ", payload: data.payload });
      // console.log("Server response: ", data);
    } catch(e) {
      alert(e.message);
    }
  }

  useEffect(() => {fetchQuiz()}, []);

  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT_QUESTION' }), [dispatch]);
  const prevQuestion = useCallback(() => dispatch({ type: 'PREV_QUESTION' }), [dispatch]);

  if (quizState.showResults) {
    return <Result />
  }

  return (
    <Box display="flex" sx={{ width: '100%' }} flexDirection="column" alignItems="center" justifyContent="center" gap="1rem" >
      {quizState.questions.length === 0 ? <CircularProgress /> : (
        <>
          <Typography variant="body1">
            {quizState.title}
          </Typography>
          <Typography variant="body1">
            Question {quizState.currentQuestionIndex + 1} / {quizState.questions.length}
          </Typography>
          <Question showAnswers={showAnswers} />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" disabled={buttonDisabled} onClick={prevQuestion}>
              Previous question
            </Button>
            <ShowAnswers showAnswersState={showAnswers} onChange={(state) => setShowAnswers(state)} />
            <Button variant="contained" onClick={nextQuestion}>Next question</Button>
          </Stack>
        </>
      )}
    </Box>
  )
}

export default Quiz;
