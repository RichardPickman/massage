import React from 'react';
import { saveToHistory } from './helpers';
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
    saveHistory: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_QUIZ': {
            const questions = action.payload.questions;
            const title = action.payload.title;
            const correctAnswers = action.payload.questions[0].correctAnswers;

            return {
                ...initialState,
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

            const isAnswered = !!state.saveHistory[currentQuestionIndex];

            const answeredQuestion =
                isAnswered && state.saveHistory[currentQuestionIndex];

            const currentAnswers = isAnswered
                ? answeredQuestion.currentAnswers
                : [];

            const saveHistory = saveToHistory(
                state,
                currentAnswers,
                currentQuestionIndex
            );

            let overallPoint = 0;
            const oneAnswerPoint = 1 / state.correctAnswers.length;

            state.currentAnswers.forEach((ans) => {
                const question = state.questions[currentQuestionIndex - 1];
                if (question.correctAnswers.includes(ans)) {
                    overallPoint += oneAnswerPoint;
                } else {
                    overallPoint -= oneAnswerPoint;
                }
            });

            const currentAnswerCount = state.currentAnswerCount + overallPoint;

            return {
                ...state,
                currentQuestionIndex,
                showResults,
                correctAnswers,
                currentAnswers,
                answers,
                saveHistory,
                currentAnswerCount,
            };
        }
        case 'PREV_QUESTION': {
            const currentQuestionIndex = state.currentQuestionIndex - 1;
            const { correctAnswers, answers } =
                state.questions[currentQuestionIndex];

            const saveHistory = saveToHistory(
                state,
                state.currentAnswers,
                currentQuestionIndex + 1
            );

            const currentAnswers =
                state.saveHistory[currentQuestionIndex].currentAnswers;

            return {
                ...state,
                currentQuestionIndex,
                showResults: false,
                correctAnswers,
                currentAnswers,
                answers,
                saveHistory,
            };
        }
        case 'RESTART': {
            return {
                ...initialState,
                questions: state.questions,
            };
        }
        case 'SELECT_ANSWER': {
            const { id } = action.payload;
            const isAnswered = state.currentAnswers.includes(id);
            const currentAnswers = isAnswered
                ? state.currentAnswers.filter((item) => item !== id)
                : [...state.currentAnswers, id];

            const saveHistory = saveToHistory(
                state,
                currentAnswers,
                state.currentQuestionIndex
            );

            return {
                ...state,
                currentAnswers,
                saveHistory,
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
