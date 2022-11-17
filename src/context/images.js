import React from 'react';
import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const initialState = {
    slides: [],
    currentIndex: 0,
    currentImage: '',
    showMenus: true,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'set_images': {
            const slides = action.payload;
            const currentImage = slides[0];

            return {
                ...state,
                slides,
                currentImage,
            };
        }
        case 'finish': {
            return initialState;
        }
        case 'next_slide': {
            const currentIndex = state.currentIndex + 1;

            return {
                ...state,
                currentIndex,
                currentImage: state.slides[currentIndex],
            };
        }
        case 'jump_to_slide': {
            const currentIndex = action.payload;

            return {
                ...state,
                currentIndex,
                currentImage: state.slides[currentIndex],
            };
        }
        case 'prev_slide': {
            const currentIndex = state.currentIndex - 1;

            return {
                ...state,
                currentIndex,
                currentImage: state.slides[currentIndex],
            };
        }
        case 'handle_menus': {
            const showMenus = action.payload;

            return {
                ...state,
                showMenus,
            };
        }
        default:
            return state;
    }
};

export const ImagesContext = createContext();

export const ImagesProvider = ({ children }) => {
    const value = useReducer(reducer, initialState);
    return (
        <ImagesContext.Provider value={value}>
            {children}
        </ImagesContext.Provider>
    );
};

ImagesProvider.propTypes = {
    children: PropTypes.node,
};
