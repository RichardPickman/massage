import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import store from './store';
import Layout from './layouts';
import Home from './pages/Home';
import Error from './pages/Error';
import ThemeProviderHook from './components/ThemeProvider';

import { quizRouter } from './routes/Quiz';
import { lectureRouter } from './routes/Lectures';
import { massageRouter } from './routes/Massage';
import { authRouter } from './routes/Auth';

import './styles.css';

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
    massageRouter,
    authRouter,
]);

const App = () => {
    return (
        <ThemeProviderHook>
            <DndProvider backend={HTML5Backend}>
                <Provider store={store}>
                    <RouterProvider router={router} />
                </Provider>
            </DndProvider>
        </ThemeProviderHook>
    );
};

export default App;
