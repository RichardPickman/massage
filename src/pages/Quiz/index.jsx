import { useContext } from "react";
import { QuizContext } from "../../context/quiz";
import Question from "../../components/Question";
import Result from "../../components/Result";
import { Box, Button, Stack, Typography } from "@mui/material";


const Quiz = () => {
  const [quizState, dispatch] = useContext(QuizContext);
  const buttonDisabled = quizState.currentQuestionIndex === 0;

  const nextQuestion = () => dispatch({ type: 'NEXT_QUESTION' });
  const prevQuestion = () => dispatch({ type: 'PREV_QUESTION' });

  if (quizState.showResults) {
    return <Result />
  }

  return (
    <Box display="flex" sx={{ width: '100%' }} flexDirection="column" alignItems="center" gap="1rem" >
      <Typography variant="body1">
        Question {quizState.currentQuestionIndex + 1} / {quizState.questions.length}
      </Typography>
      <Question />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" disabled={buttonDisabled} onClick={prevQuestion}>
          Previous question
        </Button>
        <Button variant="contained" onClick={nextQuestion}>
          Next question
        </Button>
      </Stack>
    </Box>
  )
}

export default Quiz;
