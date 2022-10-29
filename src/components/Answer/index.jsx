import { Button } from "@mui/material";
import './style.css';

const Answer = ({ answerProps }) => {
  const { 
    answerText, 
    index,
    answers,
    onSelectAnswer,
    currentAnswer,
  } = answerProps;

  const { innerWidth } = window;
  
  const isEnoughWidth = innerWidth > 720;
  const letterMapping = ['A', 'B', 'C', 'D'];
  const isCorrectAnswer = currentAnswer && answers.includes(currentAnswer);
  const isWrongAnswer = currentAnswer === answerText && !isCorrectAnswer;
  const disabled = !!currentAnswer


  return (
    <>
      {isCorrectAnswer && <Button variant="outlined" onClick={onSelectAnswer(answerText)} color="success">{isEnoughWidth && letterMapping[index]}{answerText}</Button>}
      {!isCorrectAnswer && <Button variant="outlined" onClick={onSelectAnswer(answerText)} color="error">{isEnoughWidth && letterMapping[index]}{answerText}</Button>}
      {disabled && <Button variant="outlined" onClick={onSelectAnswer(answerText)} disabled>{isEnoughWidth && letterMapping[index]}{answerText}</Button>}
      {!currentAnswer && <Button variant="outlined" onClick={onSelectAnswer(answerText)}>{isEnoughWidth && letterMapping[index]}{answerText}</Button>}
    </>
  )
}

export default  Answer;
