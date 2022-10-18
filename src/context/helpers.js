

export const checkExistance = (arr, id) => arr.find(elem => elem.id === id) ? true : false;

export const findAndReplace = (arr, data) => {
  const findIndex = arr.findIndex(elem => elem.id === data.id);
  
  arr[findIndex] = data;

  return;
}

export const handleAnswer = (arr, state) => {
  const id = state.questions[state.currentQuestionIndex].id;
  const check = checkExistance(arr, id);
  
  if (!check) {
    arr.push({
      ...state,
      id: state.questions[state.currentQuestionIndex].id,
      question: state.questions[id],
    });

    return;
  }

  const elem = arr.find(elem => elem.id === id);

  if (elem.currentAnswer === '' && state.currentAnswer) {
    findAndReplace(arr, state);

    return;
  }
}
