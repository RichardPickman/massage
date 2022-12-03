import { ImagesProvider } from '../../context/images';
import { QuizProvider } from '../../context/quiz';
import { UserProvider } from '../../context/userContext';

import { combineComponents } from '../../utils/combineComponents';

const providers = [UserProvider, QuizProvider, ImagesProvider];

export const AppContextProvider = combineComponents(...providers);
