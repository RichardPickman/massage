import { CardActions, Grid, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import ButtonHandler from '../ButtonHandler';

const containerStyle = {
    display: 'flex',
    height: 'fit-content',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
};

const Question = ({ currentState, currentQuestion, onSelect }) => {
    return (
        <>
            <div style={containerStyle}>
                {currentQuestion.img && (
                    <img
                        src={
                            typeof currentQuestion.img === 'object'
                                ? window.URL.createObjectURL(
                                      currentQuestion.img
                                  )
                                : currentQuestion.img
                        }
                        style={{
                            height: '400px',
                            width: 'auto',
                            objectFit: 'contain',
                        }}
                    />
                )}
                {currentQuestion.question && (
                    <Typography variant="h4" align="center">
                        {currentQuestion.question}
                    </Typography>
                )}
            </div>
            <CardActions>
                <Grid container spacing={2}>
                    {currentQuestion.answers.map(
                        (answer) =>
                            answer.text && (
                                <Grid item key={answer.id} xs={6}>
                                    <ButtonHandler
                                        state={{
                                            ...currentState,
                                            onSelect: onSelect,
                                            answer: answer,
                                        }}
                                    />
                                </Grid>
                            )
                    )}
                </Grid>
            </CardActions>
        </>
    );
};

export default Question;

Question.propTypes = {
    currentState: PropTypes.object,
    currentQuestion: PropTypes.object,
    onSelect: PropTypes.func,
};
