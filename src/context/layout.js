import React from 'react';
import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const initialState = {
    isShown: true,
    layoutShown: true,
    links: [
        // {
        //     name: 'Home',
        //     path: '/',
        // },
        {
            name: 'Lectures',
            path: '/lectures',
        },
        {
            name: 'Quizzes',
            path: '/quizzes',
        },
        {
            name: 'Constructor',
            path: '/quizzes/constructor',
        },
    ],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'HIDE': {
            return { ...state, isShown: false, layoutShown: false };
        }
        case 'SHOW': {
            return { ...state, isShown: true, layoutShown: true };
        }
        default:
            return state;
    }
};

export const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const value = useReducer(reducer, initialState);

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
};

LayoutProvider.propTypes = {
    children: PropTypes.node,
};
