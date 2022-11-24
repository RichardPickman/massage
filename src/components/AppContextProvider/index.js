import { ImagesProvider } from '../../context/images';
import { LayoutProvider } from '../../context/layout';
import { LoadingProvider } from '../../context/loading';
import { QuizProvider } from '../../context/quiz';
import { UserProvider } from '../../context/userContext';

import { combineComponents } from '../../utils/combineComponents';

const providers = [
    UserProvider,
    LayoutProvider,
    QuizProvider,
    ImagesProvider,
    LoadingProvider,
];

export const AppContextProvider = combineComponents(...providers);
