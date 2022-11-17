import { createContext, useReducer } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

const initialState = {
    user: {},
    isAuth: '',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'REGISTER': {
            return state;
        }
        case 'LOGIN': {
            return state;
        }

        default:
            return state;
    }
};

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const value = useReducer(reducer, initialState);

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.element,
};
