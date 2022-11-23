import {
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Typography,
} from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import ButtonHandler from '../ButtonHandler';

const Question = ({ currentState, currentQuestion, onSelect }) => {
    return (
        <>
            {typeof currentQuestion.img === 'string' ? (
                <CardMedia
                    component="img"
                    loading="lazy"
                    height="400px"
                    alt={currentQuestion.question}
                    image={currentQuestion.img}
                />
            ) : (
                <CardMedia
                    component="img"
                    loading="lazy"
                    sx={{
                        height: '400px',
                        background: '#000000',
                        objectFit: 'contain',
                    }}
                    alt={currentQuestion.question}
                    image={window.URL.createObjectURL(currentQuestion.img)}
                />
            )}
            {currentQuestion.question && (
                <CardContent>
                    <Typography variant="h4" align="center">
                        {currentQuestion.question}
                    </Typography>
                </CardContent>
            )}
            <CardActions>
                <Grid container spacing={2}>
                    {currentQuestion.answers.map(
                        (answer) =>
                            answer.text && (
                                <Grid item key={answer.id} xs={6}>
                                    <ButtonHandler
                                        state={{
                                            correctAnswers:
                                                currentState.correctAnswers,
                                            currentAnswers:
                                                currentState.currentAnswers,
                                            isFinished: currentState.isFinished,
                                            showAnswers:
                                                currentState.showAnswers,
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
