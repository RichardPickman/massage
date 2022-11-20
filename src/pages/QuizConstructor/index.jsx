import QuestionTemplate from './template';
import Alert from '../../components/Alert';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { getObjectWithId, getQuestionFormData, questionTemp } from './helpers';
import { Stack, TextField, Button, Box } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { createQuestion } from '../../http/questionApi';
import { LoadingContext } from '../../context/loading';
import { createQuiz } from '../../http/quizApi';
import { useContext } from 'react';

const QuizConstructor = () => {
    const [questions, setQuestions] = useState([]);
    const [alert, setAlert] = useState({ status: 'onhold', message: '' });
    const [title, setTitle] = useState('');
    const [id, setId] = useState('');

    const loading = useContext(LoadingContext);

    const deleteQuiz = useCallback(() => setQuestions([]), [setQuestions]);

    const saveQuiz = async () => {
        loading.toggleLoading(true);

        const questionsIds = [];

        for (let question of questions) {
            const { id, ...fields } = question;
            const getForm = getQuestionFormData(fields);
            const savedQuestion = await createQuestion(getForm);

            questionsIds.push(savedQuestion.data.payload._id);
        }

        const response = createQuiz({ questions: questionsIds, title });

        response.then((result) => {
            if (result.status === 200) {
                setId(result.data.payload._id);
                setAlert({
                    status: 'successful',
                    message: result.data.payload.message,
                });
                loading.toggleLoading(false);
            } else {
                setAlert({
                    status: 'error',
                    message: result.data.payload.message,
                });
                loading.toggleLoading(false);
            }
        });
    };

    const updateQuestion = useCallback(
        (id, data) =>
            setQuestions((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, ...data } : item
                )
            ),
        [setQuestions]
    );

    const removeQuestion = useCallback(
        (id) => setQuestions((prev) => prev.filter((item) => item.id !== id)),
        [setQuestions]
    );

    const setQuestionsCount = useCallback(
        async (amount) => {
            loading.toggleLoading(true);

            const questionsArray = [];

            for (let i = 0; i < amount; i++) {
                questionsArray.push(getObjectWithId({ ...questionTemp }));
            }

            setQuestions(questionsArray);

            loading.toggleLoading(false);
        },
        [setQuestions]
    );

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
                    path={`/quiz/${id}`}
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
                onClick={deleteQuiz}
                endIcon={<DeleteForeverIcon />}
            >
                Delete quiz
            </Button>
        </Box>
    );
};

export default QuizConstructor;
