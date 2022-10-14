import { questions } from '../db/index';
import { shuffleAnswers } from '../helpers';
const { createContext, useReducer } = require("react");


const initialState = {
  questions,
  currentQuestionIndex: 0,
  showResults: false,
  currentAnswerCount: 0,
  answers: shuffleAnswers(questions[0]),
  currentAnswer: '',
  answeredQuestions: [],
};

const reducer =  (state, action) => {
  switch (action.type) {
    case "NEXT_QUESTION": {
      const showResults = state.currentQuestionIndex === state.questions.length - 1
      const currentQuestionIndex = 
      showResults ? 
      state.currentQuestionIndex :
      state.currentQuestionIndex + 1;

      const answers = showResults ? [] : shuffleAnswers(state.questions[currentQuestionIndex])

      return {
        ...state,
        currentQuestionIndex,
        showResults,
        answers,
        currentAnswer: '',
      }
    }
    case "PREV_QUESTION": {
      const showResults = state.currentQuestionIndex === state.questions.length - 1
      const currentQuestionIndex = 
      showResults ? 
      state.currentQuestionIndex :
      state.currentQuestionIndex - 1;

      // const answers = showResults ? [] : shuffleAnswers(state.questions[currentQuestionIndex])
      
      return {
        ...state,
        currentQuestionIndex,
        showResults,
      }
    }
    case "RESTART": {
      return initialState
    }
    case 'SELECT_ANSWER': {
      const currentAnswerCount = 
      action.payload === state.questions[state.currentQuestionIndex].correctAnswer ?
      state.currentAnswerCount + 1 :
      state.currentAnswerCount

      const pushAnswer = state.answeredQuestions.push({
        ...state,
        currentAnswer: action.payload,
        currentAnswerCount,
      })
      
      return {
        ...state,
        currentAnswer: action.payload,
        currentAnswerCount,
      }
    }
    default:
      return state
  }
}

export const QuizContext = createContext();

export const QuizProvider = ({children}) => {
  const value = useReducer(reducer, initialState);
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}
