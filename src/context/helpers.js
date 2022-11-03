
export const saveToHistory = (state, currentAnswers, index) => {
  const prevQuestion = state.questions[index];
  const saveHistoryCopy = [...state.saveHistory];
  const isExist = !!saveHistoryCopy[index];

  if (isExist) {
    saveHistoryCopy[index] = {
      id: prevQuestion._id,
      currentAnswers,
    }

    return saveHistoryCopy
  }

  const result = [...saveHistoryCopy, {
    id: prevQuestion._id,
    currentAnswers,
  }];

  return result;
}
