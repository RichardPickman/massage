import { useContext, useEffect, useState } from "react";
import { QuizContext } from "../../context/quiz";
import { Button } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Answer from '../Answer'
import './style.css';


const Result = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  const [showWrong, setShowWrong] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showUnanswered, setShowUnanswered] = useState(false);

  const quiz = (snap, index) => (
    <div className='quiz' key ={index}>
      {snap.question.question && <div className="quiz__question">{snap.question.question}</div>}
      <img className="quiz__image" src={snap.question.img} alt={snap.question.correctAnswer} />
      <div className="quiz__answers">
        {snap.answers.map((answer, index) => (
          <Answer 
          answerText={answer}
          index={index}
          key={index} 
          currentAnswer={snap.currentAnswer}
          correctAnswer={snap.question.correctAnswer} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="results">
      <div className="results__discription">
        <div className="results__info">
          <p>You've got {quizState.currentAnswerCount} of {" "} {quizState.questions.length} right</p>
          <Button variant="outlined" size="large" onClick={() => dispatch({ type: 'RESTART' })}> Restart </Button>
        </div>
      </div>
      <div className="results__snapshots">
        <Button className="fold-answers" onClick={() => setShowResults(!showResults)}>
          {showResults ? "Fold" : "Unfold"} {showResults ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Button>
        <div className={`snapshots ${!showResults && 'hide'}`}>
          <div className="snapshots__filters">
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
          </div>
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
        </div>
      </div>
    </div>
  )
}

export default Result;
