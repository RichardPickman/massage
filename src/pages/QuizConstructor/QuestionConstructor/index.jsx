import { TextField, Box, Grid } from '@mui/material';
import AnswerWithCheckbox from '../../../components/AnswerWithCheckbox';
import React, { memo, useState } from 'react';
import FileUpload from '../../../components/FileUpload';
import PropTypes from 'prop-types';
import {
    fetchAnswers,
    fetchCorrectAnswers,
    fetchImage,
    fetchQuestion,
} from './fetch';

const QuestionConstructor = ({ questionId }) => {
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['']);
    const [image, setImage] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState([]);

    const addAnswer = async (answer, answerId) => {
        const fetch = await fetchAnswers(answer, answerId, answers, questionId);

        setAnswers(fetch);
        addBlank(answerId);
    };

    const handleCorrectAnswer = async (index) => {
        const fetch = await fetchCorrectAnswers(
            correctAnswers,
            index,
            questionId
        );

        setCorrectAnswers(fetch);
    };

    const addBlank = (index) =>
        index === answers.length - 1 && setAnswers([...answers, '']);

    const removeBlank = () => setAnswers(answers.slice(0, answers.length - 1));

    const handleImage = async (event) => {
        const fetch = await fetchImage(event, questionId);

        setImage(fetch);
    };

    const removeImage = () => setImage(null);

    const handleQuestion = (event) => {
        setQuestion(event.target.value);

        fetchQuestion(event, questionId);
    };

    return (
        <Box
            display="flex"
            margin={1}
            flexDirection="column"
            justifyContent="center"
            gap="1rem"
            direction="row"
            spacing={2}
        >
            <TextField
                id="outlined-basic"
                value={question}
                label="Question"
                InputLabelProps={{
                    shrink: question ? true : false,
                }}
                variant="outlined"
                onChange={handleQuestion}
            />
            <FileUpload
                image={image ? image.url : null}
                handleImage={handleImage}
                removeImage={removeImage}
            />
            <Grid container spacing={2}>
                {answers.map((answer, i) => (
                    <Grid item key={i} xs={6}>
                        <AnswerWithCheckbox
                            questionId={questionId}
                            answerId={i}
                            removeBlank={removeBlank}
                            addAnswer={addAnswer}
                            handleCorrectAnswer={handleCorrectAnswer}
                            predefinedText={answer}
                            predefinedCheckbox={correctAnswers.includes(i)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default memo(QuestionConstructor);

QuestionConstructor.propTypes = {
    questionId: PropTypes.string,
};
