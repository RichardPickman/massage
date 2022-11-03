import { Button } from '@mui/material';
import './style.css';

const Answer = ({ answerProps }) => {
  const { 
    answerText, 
    index, 
    onSelectAnswer,
    currentAnswers,
    correctAnswers,
    showAnswers,
    isFinished,
  } = answerProps;

  const answered = currentAnswers.includes(index) ? "contained" : "outlined";

  if (showAnswers) {
    if (correctAnswers.includes(index)) {
      return <Button variant="outlined" color="success">{answerText}</Button>
    }
    if (!correctAnswers.includes(index)) {
      return <Button variant="outlined" disabled>{answerText}</Button>
    }
  }

  if (isFinished) {
    if (correctAnswers.includes(index)) {
      return currentAnswers.includes(index) ?  
      <Button variant="contained" color="success">{answerText}</Button> :
      <Button variant="outlined" color="success">{answerText}</Button>
    }
    if (!correctAnswers.includes(index) && currentAnswers.includes(index)) {
      return currentAnswers.includes(index) ?  
      <Button variant="contained" color="error">{answerText}</Button> :
      <Button variant="outlined" color="error">{answerText}</Button>
    }

    if (!currentAnswers.includes(index)) {
      return <Button variant="outlined" disabled>{answerText}</Button>
    }

  }

  return (
    <Button 
      variant={answered} 
      onClick={() => onSelectAnswer(index)}
    >
      {answerText}
    </Button>
  );  
}

export default  Answer;
