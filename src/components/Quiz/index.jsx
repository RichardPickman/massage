import { useContext } from "react";
import { QuizContext } from "../../context/quiz";
import Question from "../Question";
import Result from "../Result";
import { Button } from "@mui/material";
import './style.css'

const Quiz = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  return (
    <>
      {quizState.showResults && <Result />}
      {!quizState.showResults && (
        <div className="question-block">
          <div className="score">
            Question {quizState.currentQuestionIndex + 1} / {quizState.questions.length}
          </div>
          <Question />
          <div className="next-button">
          <Button
          variant="contained"
          sx={{ width: '50%' }}
          onClick={() => dispatch({ type: 'NEXT_QUESTION' })}>
            Next question
          </Button>
          </div>
      </div>
      )}
    </>
  )
}

export default Quiz;
