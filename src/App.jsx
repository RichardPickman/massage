import React from 'react';
import Home from './pages/Home';
import ThemeProviderHook from './components/ThemeProvider';
import Layout from './layouts';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppContextProvider } from './components/AppContextProvider';
import { quizRouter } from './routes/Quiz';
import { lectureRouter } from './routes/Lectures';

import './styles.css';
import Error from './pages/Error';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },
    ...lectureRouter,
    quizRouter,
]);

const App = () => {
    return (
        <AppContextProvider>
            <ThemeProviderHook>
                <DndProvider backend={HTML5Backend}>
                    <RouterProvider router={router} />
                </DndProvider>
            </ThemeProviderHook>
        </AppContextProvider>
    );
};

export default App;
