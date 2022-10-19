import { useContext, useState } from "react";
import { QuizContext } from "../../context/quiz";
import { Button, Stack, Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Answer from '../Answer';


const Result = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  const [showWrong, setShowWrong] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showUnanswered, setShowUnanswered] = useState(false);

  const answerProps = (snap, answer, index) => ({
    answerText: answer,
    index,
    key: index, 
    currentAnswer: snap.currentAnswer,
    correctAnswer: snap.question.correctAnswer,
    onSelectAnswer: () => { return; },
  })

  const quiz = (snap, index) => (
    <Box display="flex" flexDirection="column" gap="1rem" justifyContent="center" alignItems="center" key={index}>
      {snap.question.question && <Typography variant="body1">{snap.question.question}</Typography>}
      <Box display="flex" justifyContent="center">
        <img className="image" src={snap.question.img} alt={snap.question.correctAnswer} />
      </Box>
      <Stack direction="row" spacing={1}>
        {snap.answers.map((answer, index) => (<Answer answerProps={answerProps(snap, answer, index)} />))}
      </Stack>
    </Box>
  )

  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Box display="flex" flexDirection="column" gap="1rem" justifyContent="center" alignItems="center">
          <Typography variant="body1">You've got {quizState.currentAnswerCount} of {" "} {quizState.questions.length} right</Typography>
          <Button variant="outlined" size="large" onClick={() => dispatch({ type: 'RESTART' })}> Restart </Button>
      </Box>
      <Box display="flex" flexDirection="column" gap="1rem">
        <Button className="fold-answers" onClick={() => setShowResults(!showResults)}>
          {showResults ? "Fold" : "Unfold"} {showResults ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Button>
        <Box 
          display={`${showResults ? "flex" : "none"}`}
          flexDirection="column" 
          gap="1rem"
          alignItems="center">
          <Stack direction="row" spacing={1}>
            <Button 
              className="fold-answers"
              variant={`${showWrong ? "contained" : "outlined"}`}
              onClick={() => {
                setShowWrong(!showWrong);
                setShowUnanswered(false);
              }}>
              Show wrong answers
            </Button>
            <Button
              className="fold-answers"
              variant={`${showUnanswered ? "contained" : "outlined"}`}
              onClick={() => {
                setShowUnanswered(!showUnanswered);
                setShowWrong(false);
              }}>
              Show unanswered
            </Button>
          </Stack>
          {showUnanswered && quizState.answeredQuestions
          .filter((item) => item.currentAnswer === '')
          .map((snap, index) => quiz(snap, index))}

          {showWrong && quizState.answeredQuestions
          .filter((item) => 
          (item.currentAnswer !== item.question.correctAnswer && item.currentAnswer !== ''))
          .map((snap, index) => quiz(snap, index))}

          {!showWrong && !showUnanswered && 
          quizState.answeredQuestions
          .map((snap, index) => quiz(snap, index))}
        </Box>
      </Box>
    </Box>
  )
}

export default Result;
