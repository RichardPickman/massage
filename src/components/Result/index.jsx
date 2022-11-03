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

  const quiz = (snap, index) => {
    const questionSnap = quizState.questions.find(item => item._id === snap.id);

    const answerProps = (answerText, index) => ({
      answerText,
      index,
      currentAnswers: snap.currentAnswers,
      correctAnswers: questionSnap.correctAnswers,
      showAnswers: false,
      isFinished: true,
      onSelectAnswer: () => { return; },
    });

    return (
      <Box display="flex" flexDirection="column" gap="1rem" justifyContent="center" alignItems="center" key={index}>
        {questionSnap.question && <Typography variant="body1">{questionSnap.question}</Typography>}
        {questionSnap.img && <Box display="flex" justifyContent="center">
          <img className="image" src={questionSnap.img} alt={questionSnap.correctAnswer} />
        </Box>}
        <Stack direction="row" spacing={1}>
          {questionSnap.answers.map((answer, index) => <Answer key={index} answerProps={answerProps(answer, index)} />)}
        </Stack>
      </Box>
    )
  };

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
          {showUnanswered && quizState.saveHistory
          .filter((item) => item.currentAnswers.length === 0)
          .map((snap, index) => quiz(snap, index))}

          {showWrong && quizState.saveHistory
          .filter((item) => {
            const question = quizState.questions.find(quest => quest._id === item.id);

            return item.currentAnswers.some((ans) => !question.correctAnswers.includes(ans));
          })
          .map((snap, index) => quiz(snap, index))}

          {!showWrong && !showUnanswered && 
          quizState.saveHistory
          .map((snap, index) => quiz(snap, index))}
        </Box>
      </Box>
    </Box>
  )
}

export default Result;
