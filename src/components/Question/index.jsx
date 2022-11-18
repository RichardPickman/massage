import {
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Typography,
} from '@mui/material';
import Answer from '../Answer';
import React from 'react';
import PropTypes from 'prop-types';

const Question = ({ currentState, currentQuestion }) => {
    const answerProps = (answer, index) => ({
        answerText: answer,
        predefinedText: '',
        predefinedCheckbox: false,
        index,
        ...currentState,
    });

    return (
        <>
            {currentQuestion.img && (
                <CardMedia
                    component="img"
                    alt={currentQuestion.question}
                    height="140"
                    image={currentQuestion.img}
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
                    {currentQuestion.answers
                        .filter((item) => item !== '')
                        .map((answer, index) => (
                            <Grid item key={index} xs={6}>
                                <Answer
                                    answerProps={answerProps(answer, index)}
                                />
                            </Grid>
                        ))}
                </Grid>
            </CardActions>
        </>
    );
};

export default Question;

Question.propTypes = {
    currentState: PropTypes.object,
    currentQuestion: PropTypes.object,
};
