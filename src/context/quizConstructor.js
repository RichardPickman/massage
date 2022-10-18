const { createContext, useReducer } = require("react");

const initialState = {
  questions: [],
  title: '',
  questionCount: 0,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_QUESTION": {
      return state;
    }
    case "REMOVE_QUESTION": {
      return state;
    }
    case "EDIT_QUESTION": {
      return state;
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
