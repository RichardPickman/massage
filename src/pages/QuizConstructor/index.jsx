import QuestionTemplate from './template';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { Stack, TextField, Button, Box } from '@mui/material';
import { createQuiz } from '../../http/quizApi';
import { getQuestionFormData, questionTemp } from './helpers';
import React, { useCallback, useState } from 'react';
import Alert from '../../components/Alert';
import { createQuestion, fetchUpdateQuestion } from '../../http/questionApi';
import { useContext } from 'react';
import { LoadingContext } from '../../context/loading';

const QuizConstructor = () => {
    const loading = useContext(LoadingContext);
    const [questions, setQuestions] = useState([]);
    const [alert, setAlert] = useState({ status: 'onhold' });
    const [title, setTitle] = useState('');
    const [id, setId] = useState('');

    const deleteQuiz = useCallback(() => setQuestions([]), [setQuestions]);

    const saveQuiz = async () => {
        loading.toggleLoading(true);

        const response = await createQuiz({ questions, title });

        if (response.status === 200) {
            setId(response.data.payload._id);
            setAlert({ status: 'successful' });
            loading.toggleLoading(false);
        } else {
            setAlert({ status: 'error' });
            loading.toggleLoading(false);
        }
    };

    const updateQuestion = useCallback(async (id, data) => {
        const form = await getQuestionFormData(data);

        const fetch = await fetchUpdateQuestion(id, form);

        setQuestions((prev) =>
            prev.map((item) =>
                item.id === data.id ? fetch.data.payload : item
            )
        );
    }, []);

    const removeQuestion = useCallback((id) => {
        setQuestions((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const setQuestionsCount = useCallback(async (amount) => {
        loading.toggleLoading(true);

        const questionsArray = [];

        for (let i = 0; i < amount; i++) {
            const quest = await createQuestion(questionTemp);

            questionsArray.push(quest.data.payload);
        }

        setQuestions(questionsArray);

        loading.toggleLoading(false);
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            gap="2rem"
        >
            {alert.status !== 'onhold' && (
                <Alert
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
                            questionData={item}
                            key={item._id}
                            removeQuestion={removeQuestion}
                            updateQuestion={updateQuestion}
                            questionId={item.id}
                            isPreview={item.isPreview}
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
