import React from 'react';
import ReactDOM from 'react-dom/client';
import { QuizProvider } from './context/quiz';
import App from './App';
import { ConstructorProvider } from './context/quizConstructor';



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
  // <QuizProvider>
    <ConstructorProvider>
     <App />
    </ConstructorProvider>
  // </QuizProvider>
  // </React.StrictMode>
);
