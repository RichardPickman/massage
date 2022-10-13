import './style.css';

const Answer = ({ 
  answerText, 
  index, 
  onSelectAnswer,
  currentAnswer,
  correctAnswer
}) => {
  const letterMapping = ['A', 'B', 'C', 'D'];
  const { innerWidth } = window;
  const isCorrectAnswer = currentAnswer && answerText === correctAnswer;
  const isWrongAnswer = currentAnswer === answerText && currentAnswer !== correctAnswer;
  const wrongClass = isWrongAnswer ? "wrong" : "";
  const correctClass = isCorrectAnswer ? "success" : "";
  const disabledClass = currentAnswer ? "disabled" : "";


  return (
    <div
    className={`answer ${wrongClass} ${correctClass} ${disabledClass}`}
    onClick={() => onSelectAnswer(answerText)}>
      {innerWidth > 840 && `${letterMapping[index]}.`} {answerText}
    </div>
  )
}

export default  Answer;
