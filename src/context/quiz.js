import React from 'react';
import { countGrade, saveToHistory } from './helpers';
import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const initialState = {
    questions: [],
    title: '',
    currentQuestionIndex: 0,
    showResults: false,
    currentAnswerCount: 0,
    answers: [],
    correctAnswers: [],
    currentAnswers: [],
    history: [],
    currentQuestion: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_QUIZ': {
            const questions = action.payload.questions;
            const title = action.payload.title;
            const correctAnswers = action.payload.questions[0].correctAnswers;
            const currentQuestion = questions[0];

            return {
                ...initialState,
                currentQuestion,
                questions,
                title,
                correctAnswers,
            };
        }
        case 'NEXT_QUESTION': {
            const showResults =
                state.currentQuestionIndex === state.questions.length - 1;

            const currentQuestionIndex = showResults
                ? state.currentQuestionIndex
                : state.currentQuestionIndex + 1;

            const { correctAnswers, answers } =
                state.questions[currentQuestionIndex];

            const isAnswered = !!state.history[currentQuestionIndex];

            const answeredQuestion =
                isAnswered && state.history[currentQuestionIndex];

            const currentAnswers = isAnswered
                ? answeredQuestion.currentAnswers
                : [];

            const history = saveToHistory(
                state,
                currentAnswers,
                currentQuestionIndex
            );

            return {
                ...state,
                currentQuestionIndex,
                showResults,
                correctAnswers,
                currentAnswers,
                answers,
                history,
                currentAnswerCount: showResults ? countGrade(state) : 0,
            };
        }
        case 'PREV_QUESTION': {
            const currentQuestionIndex = state.currentQuestionIndex - 1;
            const currentQuestion = state.questions[currentQuestionIndex];
            const { correctAnswers, answers } =
                state.questions[currentQuestionIndex];

            const history = saveToHistory(
                state,
                state.currentAnswers,
                currentQuestionIndex + 1
            );

            const currentAnswers =
                state.history[currentQuestionIndex].currentAnswers;

            return {
                ...state,
                currentQuestionIndex,
                currentQuestion,
                showResults: false,
                correctAnswers,
                currentAnswers,
                answers,
                history,
            };
        }
        case 'RESTART': {
            return {
                ...initialState,
                currentQuestion: state.questions[0],
                questions: state.questions,
                title: state.question,
            };
        }
        case 'SELECT_ANSWER': {
            const { id } = action.payload;
            const isAnswered = state.currentAnswers.includes(id);
            const currentAnswers = isAnswered
                ? state.currentAnswers.filter((item) => item !== id)
                : [...state.currentAnswers, id];

            const history = saveToHistory(
                state,
                currentAnswers,
                state.currentQuestionIndex
            );

            return {
                ...state,
                currentAnswers,
                history,
            };
        }
        default:
            return state;
    }
};

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const value = useReducer(reducer, initialState);
    return (
        <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
    );
};

QuizProvider.propTypes = {
    children: PropTypes.element,
};
