import { Box, Card, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { QuizContext } from "../../context/quiz";
import Answer from "../Answer";
import "./style.css";


const Question = ({ showAnswers }) => {
  const [quizState, dispatch] = useContext(QuizContext);
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  const answerProps = (answer, index) => ({
    answerText: answer,
    isFinished: quizState.showResults,
    predefinedText: '',
    predefinedCheckbox: false,
    showAnswers,
    index,
    answers: currentQuestion.answers,
    currentAnswers: quizState.currentAnswers,
    correctAnswers: currentQuestion.correctAnswers,
    onSelectAnswer: (answerIndex) => dispatch({ type: 'SELECT_ANSWER', payload: { answerIndex } })
  });

  return (
    <Card>
      <Box  display="flex" flexDirection="column" alignItems="center" gap="1rem" margin={2}>
        {currentQuestion.question && <Typography variant="body1">{currentQuestion.question}</Typography>}
        {currentQuestion.img &&  <Box display="flex" justifyContent="center"><img className="image" src={currentQuestion.img} alt="" /></Box>}
        <Stack direction="row" spacing={1}>
          {currentQuestion.answers.map((answer, index) => (<Answer key={index} answerProps={answerProps(answer, index)} />))}
        </Stack>
      </Box>
    </Card>
  )
}

export default Question;
