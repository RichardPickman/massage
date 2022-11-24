import React from 'react';
import Home from './pages/Home';
import ThemeProviderHook from './components/ThemeProvider';
import Layout from './layouts';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppContextProvider } from './components/AppContextProvider';
import { quizRouter } from './routes/Quiz';
import { lectureRouter } from './routes/Lectures';

import './styles.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },
    lectureRouter,
    quizRouter,
]);

const App = () => {
    return (
        <AppContextProvider>
            <ThemeProviderHook>
                <RouterProvider router={router} />
            </ThemeProviderHook>
        </AppContextProvider>
    );
};

export default App;
