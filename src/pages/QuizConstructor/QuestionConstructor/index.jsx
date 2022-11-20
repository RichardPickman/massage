import AnswerWithCheckbox from '../../../components/AnswerWithCheckbox';
import FileUpload from '../../../components/FileUpload';
import { TextField, Box, Grid } from '@mui/material';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { getObjectWithId } from '../helpers';

const QuestionConstructor = ({ questionData, questionId, updateQuestion }) => {
    const [question, setQuestion] = useState(questionData.question);
    const [answers, setAnswers] = useState(questionData.answers);
    const [image, setImage] = useState(questionData.image);
    const [correctAnswers, setCorrectAnswers] = useState(
        questionData.correctAnswers
    );

    const addAnswer = useCallback(
        (answer) => {
            const answersCopy = answers.map((item) =>
                item.id === answer.id ? answer : item
            );

            setAnswers(answersCopy);
            addBlank(answer.id);

            updateQuestion(questionId, { answers: answersCopy });
        },
        [answers, setAnswers]
    );

    const handleCorrectAnswer = useCallback(
        (id) => {
            const correctAnswersCopy = correctAnswers.includes(id)
                ? correctAnswers.filter((item) => item !== id)
                : [...correctAnswers, id];

            setCorrectAnswers(correctAnswersCopy);
            updateQuestion(questionId, { correctAnswers: correctAnswersCopy });
        },
        [correctAnswers, setCorrectAnswers]
    );

    const addBlank = (id) =>
        answers.findIndex((item) => item.id === id) === answers.length - 1 &&
        setAnswers([...answers, getObjectWithId({ text: '' })]);

    const removeEmpty = useCallback(
        (answerId) => {
            const filterAnswers = answers.filter(
                (item) => item.id !== answerId
            );
            const filterCorrectAnswers = correctAnswers.filter(
                (item) => item !== answerId
            );

            setAnswers(filterAnswers);
            setCorrectAnswers(filterCorrectAnswers);

            updateQuestion(questionId, {
                answers: filterAnswers,
                correctAnswers: filterCorrectAnswers,
            });
        },
        [answers, correctAnswers]
    );

    const handleImage = useCallback(
        (event) => {
            setImage(event.target.files[0]);

            updateQuestion(questionId, { img: event.target.files[0] });
        },
        [questionId, setImage]
    );

    const removeImage = useCallback(() => setImage(null), [setImage]);

    const handleQuestion = useCallback(
        (event) => {
            setQuestion(event.target.value);
            updateQuestion(questionId, { question: event.target.value });
        },
        [setQuestion]
    );

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
