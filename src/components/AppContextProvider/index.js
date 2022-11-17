import { ImagesProvider } from '../../context/images';
import { LayoutProvider } from '../../context/layout';
import { QuizProvider } from '../../context/quiz';
import { UserProvider } from '../../context/userContext';

import { combineComponents } from '../../utils/combineComponents';

const providers = [UserProvider, LayoutProvider, QuizProvider, ImagesProvider];

export const AppContextProvider = combineComponents(...providers);
