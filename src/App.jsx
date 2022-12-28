import React from 'react';
import Home from './pages/Home';
import ThemeProviderHook from './components/ThemeProvider';
import Layout from './layouts';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { quizRouter } from './routes/Quiz';
import { lectureRouter } from './routes/Lectures';
import { massageRouter } from './routes/Massage';

import './styles.css';
import Error from './pages/Error';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import store from './store';

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
