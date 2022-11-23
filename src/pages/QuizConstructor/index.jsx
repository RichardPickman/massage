import React, { useState } from 'react';

import Alert from '../../components/Alert';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import QuestionTemplate from './template';
import QuestionService from '../../services/Question';
import QuizService from '../../services/Quiz';

import { getObjectWithId, prepareQuestion, questionTemp } from './helpers';
import { Stack, TextField, Button, Box } from '@mui/material';
import { LoadingContext } from '../../context/loading';
import { useContext } from 'react';

const QuizConstructor = () => {
    const [questions, setQuestions] = useState([]);
    const [alert, setAlert] = useState({ status: 'onhold', message: '' });
    const [title, setTitle] = useState('');
    const [id, setId] = useState('');

    const loading = useContext(LoadingContext);

    const saveQuiz = async () => {
        loading.toggleLoading(true);

        const savedQuestions = questions.map((question) => {
            const preparedQuestion = prepareQuestion(question);

            return QuestionService.createQuestion(preparedQuestion);
        });

        const ids = await Promise.all(savedQuestions).then((result) =>
            result.map((question) => (question ? question.payload._id : null))
        );

        try {
            const response = await QuizService.createQuiz({
                questions: ids,
                title: title,
            });

            setId(response.payload._id);

            setAlert({
                status: 'successful',
                message: response.message,
            });
        } catch (e) {
            setAlert({
                status: 'error',
                message: e.message,
            });
        } finally {
            loading.toggleLoading(false);
        }
    };

    const updateQuestion = (id, data) =>
        setQuestions((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...data } : item))
        );

    const removeQuestion = (id) =>
        setQuestions((prev) => prev.filter((item) => item.id !== id));

    const setQuestionsCount = async (amount) => {
        loading.toggleLoading(true);

        const questionsArray = [];

        for (let i = 0; i < amount; i++) {
            questionsArray.push(getObjectWithId({ ...questionTemp }));
        }

        setQuestions(questionsArray);

        loading.toggleLoading(false);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            gap="2rem"
        >
            {alert.status !== 'onhold' && (
                <Alert
                    text={alert.message}
                    status={alert.status}
                    onClose={() => setAlert({ status: 'onhold' })}
                    path={`/quizzes/${id}`}
                />
            )}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                gap="1rem"
            >
                <Stack direction="column" spacing={2}>
                    <TextField
                        id="outlined-basic"
                        label="Quiz title"
                        variant="outlined"
                        onChange={(event) => setTitle(event.target.value)}
                        value={title}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Questions amount"
                        variant="outlined"
                        type="number"
                        inputProps={{ min: 1, max: 100 }}
                        onChange={(event) =>
                            setQuestionsCount(event.target.value)
                        }
                    />
                </Stack>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                gap="1rem"
            >
                {questions.map((item) => {
                    return (
                        <QuestionTemplate
                            removeQuestion={removeQuestion}
                            updateQuestion={updateQuestion}
                            isPreview={item.isPreview}
                            questionId={item.id}
                            questionData={item}
                            key={item.id}
                        />
                    );
                })}
            </Box>
            <Button
                variant="contained"
                color="success"
                onClick={saveQuiz}
                endIcon={<SaveIcon />}
            >
                Save quiz
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={() => setQuestions([])}
                endIcon={<DeleteForeverIcon />}
            >
                Delete quiz
            </Button>
        </Box>
    );
};

export default QuizConstructor;
