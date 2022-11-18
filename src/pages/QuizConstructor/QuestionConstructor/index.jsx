import { TextField, Box, Grid } from '@mui/material';
import AnswerWithCheckbox from '../../../components/AnswerWithCheckbox';
import React, { memo, useState } from 'react';
import FileUpload from '../../../components/FileUpload';
import PropTypes from 'prop-types';

const QuestionConstructor = ({
    questionId,
    updateQuestion,
    removeQuestion,
}) => {
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['']);
    const [image, setImage] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState([]);

    const addAnswer = (answer, answerIndex) => {
        const answersCopy = answers.map((item, index) =>
            index === answerIndex ? answer : item
        );

        setAnswers(answersCopy);
        addBlank(answerIndex);

        updateQuestion(questionId, { answers: answersCopy });
    };

    const handleCorrectAnswer = (index) => {
        const isExist = correctAnswers.includes(index);
        const correctAnswersCopy = isExist
            ? correctAnswers.filter((item) => item !== index)
            : [...correctAnswers, index];

        setCorrectAnswers(correctAnswersCopy);

        updateQuestion(questionId, { correctAnswers: correctAnswersCopy });
    };

    const addBlank = (index) =>
        index === answers.length - 1 && setAnswers([...answers, '']);

    const removeBlank = () => setAnswers(answers.slice(0, answers.length - 1));

    const handleImage = async (event) => {
        setImage(event.target.files[0]);

        updateQuestion(questionId, { img: event.target.files[0] });
    };

    const removeImage = () => setImage(null);

    const handleQuestion = (event) => {
        setQuestion(event.target.value);
        updateQuestion(questionId, { question: question });
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
                image={image ? window.URL.createObjectURL(image) : null}
                handleImage={handleImage}
                removeImage={removeImage}
            />
            <Grid container spacing={2}>
                {answers.map((answer, i) => (
                    <Grid item key={i} xs={6}>
                        <AnswerWithCheckbox
                            questionId={questionId}
                            answerIndex={i}
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
    updateQuestion: PropTypes.func,
    removeQuestion: PropTypes.func,
};
