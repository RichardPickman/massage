import { useContext } from "react";
import { QuizContext } from "../../context/quiz";
import Answer from "../Answer";
import './style.css'


const Question = () => {
  const [quizState, dispatch] = useContext(QuizContext);
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex]

  return (
    <div className="quiz">
      {currentQuestion.question && 
      <div className="quiz__question">{currentQuestion.question}</div>
      }
      <img className="quiz__image" src={currentQuestion.img} alt="" />
      <div className="quiz__answers">
        {quizState.answers.map((answer, index) => (
          <Answer 
          answerText={answer}
          index={index}
          key={index} 
          currentAnswer={quizState.currentAnswer}
          correctAnswer={currentQuestion.correctAnswer}
          onSelectAnswer={(answerText) => 
            dispatch({ type: 'SELECT_ANSWER', payload: answerText })}/>
        ))}
      </div>
    </div>
  )
}

export default Question;
