import AnswerWithCheckbox from '../../../components/AnswerWithCheckbox';
import FileUpload from '../../../components/FileUpload';
import { TextField, Box, Grid } from '@mui/material';
import { getObjectWithId } from '../helpers';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const QuestionConstructor = ({ questionData, questionId, updateQuestion }) => {
    const [question, setQuestion] = useState(questionData.question);
    const [answers, setAnswers] = useState(questionData.answers);
    const [image, setImage] = useState(questionData.img);
    const [correctAnswers, setCorrectAnswers] = useState(
        questionData.correctAnswers
    );

    const [listRef] = useAutoAnimate();

    const addAnswer = (answer) => {
        const answersCopy = answers.map((item) =>
            item.id === answer.id ? answer : item
        );

        if (answersCopy[answersCopy.length - 1].text) {
            const blankAnswer = getObjectWithId({ text: '' });

            answersCopy.push(blankAnswer);
        }

        setAnswers(answersCopy);

        updateQuestion(questionId, { answers: answersCopy });
    };

    const handleCorrectAnswer = (id) => {
        const correctAnswersCopy = correctAnswers.includes(id)
            ? correctAnswers.filter((item) => item !== id)
            : [...correctAnswers, id];

        setCorrectAnswers(correctAnswersCopy);
        updateQuestion(questionId, { correctAnswers: correctAnswersCopy });
    };

    const removeEmpty = (answerId) => {
        const filterAnswers = answers.filter((item) => item.id !== answerId);
        const filterCorrectAnswers = correctAnswers.filter(
            (item) => item !== answerId
        );

        setAnswers(filterAnswers);
        setCorrectAnswers(filterCorrectAnswers);

        updateQuestion(questionId, {
            answers: filterAnswers,
            correctAnswers: filterCorrectAnswers,
        });
    };

    const handleImage = (event) => {
        setImage(event.target.files[0]);

        updateQuestion(questionId, { img: event.target.files[0] });
    };

    const handleImageRemove = () => {
        setImage(null);

        updateQuestion(questionId, { img: null });
    };

    const handleQuestion = (event) => {
        setQuestion(event.target.value);
        updateQuestion(questionId, { question: event.target.value });
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
                text={image ? image.name : 'File unnamed'}
                handleImage={handleImage}
                removeImage={handleImageRemove}
            />
            <Grid container spacing={2} ref={listRef}>
                {answers.map((answer) => (
                    <Grid item key={answer.id} xs={6}>
                        <AnswerWithCheckbox
                            questionId={questionId}
                            id={answer.id}
                            removeEmpty={removeEmpty}
                            addAnswer={addAnswer}
                            handleCorrectAnswer={handleCorrectAnswer}
                            predefinedText={answer.text}
                            predefinedCheckbox={correctAnswers.includes(
                                answer.id
                            )}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default QuestionConstructor;

QuestionConstructor.propTypes = {
    questionData: PropTypes.object,
    questionId: PropTypes.string,
    updateQuestion: PropTypes.func,
    removeQuestion: PropTypes.func,
};
