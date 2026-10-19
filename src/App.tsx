import { useLayoutEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RouterProvider } from 'react-router-dom';

import router from './routes';
import { onSessionExpired } from './services/helpers/session';
import { getToken } from './services/helpers/token';
import { useAppDispatch, useAppSelector } from './store';
import { fetchRefresh } from './store/reducers/auth/fetch';
import { clearSession } from './store/reducers/auth/user';
import './styles.css';

const App = () => {
    const { user } = useAppSelector((state) => state.auth);
    const isRefreshRequested = useRef(false);
    const dispatch = useAppDispatch();

    // A rejected token is announced by the request layer; clearing the store
    // here keeps every 401, wherever it came from, on the logout path.
    useLayoutEffect(
        () => onSessionExpired(() => dispatch(clearSession())),
        [dispatch]
    );

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
