import { useContext } from "react";
import { QuizContext } from "../../context/quiz";
import Question from "../../components/Question";
import Result from "../../components/Result";
import { Button } from "@mui/material";
import './style.css'

const Quiz = () => {
  const [quizState, dispatch] = useContext(QuizContext);
  const buttonDisabled = quizState.currentQuestionIndex === 0

  return (
    <>
      {quizState.showResults ? <Result /> : 
      <div className="question-block">
        <div className="score">
          Question {quizState.currentQuestionIndex + 1} / {quizState.questions.length}
        </div>
        <Question />
        <div className="next-button">
          <Button
          variant="contained"
          sx={{ width: '50%' }}
          disabled={buttonDisabled}
          onClick={() => dispatch({ type: 'PREV_QUESTION' })}>
            Previous question
          </Button>
          <Button
          variant="contained"
          sx={{ width: '50%' }}
          onClick={() => dispatch({ type: 'NEXT_QUESTION' })}>
            Next question
          </Button>
        </div>
      </div>}
    </>
  )
}

export default Quiz;
