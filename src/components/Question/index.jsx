import { Box, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { QuizContext } from "../../context/quiz";
import Answer from "../Answer";
import "./style.css";


const Question = () => {
  const [quizState, dispatch] = useContext(QuizContext);
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  const answerProps = (answer, index) => ({
    answerText: answer,
    index,
    key: index, 
    currentAnswer: quizState.currentAnswer,
    correctAnswer: currentQuestion.correctAnswer,
    onSelectAnswer: (answerText) => dispatch({ type: 'SELECT_ANSWER', payload: answerText })
  })

  return (
    <Box  display="flex" flexDirection="column" alignItems="center" gap="1rem">
      {currentQuestion.question && <Typography variant="body1">{currentQuestion.question}</Typography>}
      <Box display="flex" justifyContent="center">
        <img className="image" src={currentQuestion.img} alt="" />
      </Box>
      <Stack direction="row" spacing={1}>
        {quizState.answers.map((answer, index) => (<Answer answerProps={answerProps(answer, index)} />))}
      </Stack>
    </Box>
  )
}

export default Question;
