import { useContext } from "react";
import { QuizContext } from "../../context/quiz";
import './style.css'


const Result = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  return (
    <div className="results">
      <div className="results-info">
        <p>You've got {quizState.currentAnswerCount} of {" "} {quizState.questions.length} right</p>
        <div className="button" onClick={() => dispatch({ type: 'RESTART' })}>
          Restart
        </div>
      </div>
    </div>
  )
}

export default Result;
