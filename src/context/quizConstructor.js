const { createContext, useReducer } = require("react");

const questionInitialState = (id = 0) => ({
  id,
  question: "",
  img: "",
  answers: [''],
  correctAnswers: [],
  isSaved: false,
})

const initialState = {
  questions: [],
  title: '',
}

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_QUESTION": {
      const currentIndex = state.questions.length;
      const temp = questionInitialState(currentIndex);
      const questions = [...state.questions, temp];
 
      return {
        ...state,
        questions,
      }
    }
    case "REMOVE_QUESTION": {
      const questions = state.filter(payload => payload.id !== state.questionId);

      return {
        ...state,
        questions
      }
    }
    case "EDIT_QUESTION": {
      const questions = state.questions.map(quest => {
        if (quest.id === state.payload.id) {
          return state.payload
        }

        return quest;
      });

      return {
        ...state,
        questions,
      };
    }
    case "SAVE_QUESTION": {
      const questions = state.questions.map(quest => {
        if (quest.id === action.payload.questionIndex) {
          const questCopy = quest;

          questCopy.isSaved = true;

          return questCopy;
        }

        return quest;
      })

      return {
        ...state,
        questions
      }
    }
    case "SET_TITLE": {
      return {
        ...state,
        title: action.payload,
      };
    }
    case "ADD_ANSWER": {
      const questions = state.questions.map(quest => {
        if (quest.id === action.payload.questionIndex) {
          const questCopy = quest;

          questCopy.answers[action.payload.answerId] = action.payload.currentAnswer;

          return questCopy;
        }

        return quest;
      })

      return {
        ...state,
        questions
      }
    }
    case "ADD_BLANK_ANSWER": {
      const questions = state.questions.map(quest => {
        if (quest.id === action.payload.questionIndex) {
          const questCopy = quest;
          const isAnswerLast = questCopy.answers.length - 1 === action.payload.answerId;

          if (isAnswerLast) {
            questCopy.answers = [...questCopy.answers, ''];
          }

          return questCopy;
        }

        return quest;
      })

      return {
        ...state,
        questions
      }
    }
    case "ADD_CORRECT_ANSWER": {
      const questions = state.questions.map(quest => {
        if (quest.id === action.payload.questionIndex) {
          const questCopy = quest;
          const answerIndex = questCopy.answers.findIndex((ans) => ans === action.payload.currentAnswer);
          
          questCopy.correctAnswers = [...questCopy.correctAnswers, answerIndex];

          return questCopy;
        }

        return quest;
      })

      return {
        ...state,
        questions
      }
    }
    case "REMOVE_CORRECT_ANSWER": {
      const questions = state.questions.map(quest => {
        if (quest.id === action.payload.questionIndex) {
          const questCopy = quest;
          const answerIndex = questCopy.answers.findIndex((ans) => ans === action.payload.currentAnswer);
          
          questCopy.correctAnswers = questCopy.correctAnswers.filter((i) => i !== answerIndex);

          return questCopy;
        }

        return quest;
      })

      return {
        ...state,
        questions
      }
    }
    default:
      return state;
  }
}


export const ConstructorContext = createContext();

export const ConstructorProvider = ({children}) => {
  const value = useReducer(reducer, initialState);

  return <ConstructorContext.Provider value={value}>{children}</ConstructorContext.Provider>
}
