import React, { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RouterProvider } from 'react-router-dom';

import router from './routes';
import ThemeProviderHook from './components/ThemeProvider';

import './styles.css';
import { fetchRefresh } from './store/reducers/auth/fetch';

const App = () => {
    const { user } = useSelector((state) => state.auth);
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if (!user) {
            if (token) {
                dispatch(fetchRefresh());
            }
        }
    }, []);

    return (
        <ThemeProviderHook>
            <DndProvider backend={HTML5Backend}>
                <RouterProvider router={router} />
            </DndProvider>
        </ThemeProviderHook>
    );
};

export default App;
