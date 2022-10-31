import { QuizProvider } from '../../context/quiz';
import { ConstructorProvider } from '../../context/quizConstructor';
import { UserProvider } from '../../context/userContext';

import { combineComponents } from '../../utils/combineComponents';

const providers = [
  UserProvider,
  ConstructorProvider,
  QuizProvider,
]

export const AppContextProvider = combineComponents(...providers);
