import { useLayoutEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import router from './routes';
import { getToken } from './services/helpers/token';
import { fetchRefresh } from './store/reducers/auth/fetch';
import './styles.css';

const App = () => {
    const { user } = useSelector((state) => state.auth);
    const isRefreshRequested = useRef(false);
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const shouldRefresh =
            !isRefreshRequested.current && !user && Boolean(getToken());

        if (!shouldRefresh) {
            return;
        }

        isRefreshRequested.current = true;

        dispatch(fetchRefresh());
    }, [user, dispatch]);

    return (
        <DndProvider backend={HTML5Backend}>
            <RouterProvider router={router} />
        </DndProvider>
    );
};

export default App;
