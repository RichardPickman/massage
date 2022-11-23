import { Box, Button, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLoaderData } from 'react-router-dom';
import React from 'react';
import QuizService from '../../services/Quiz';

const Quizzes = () => {
    const loaderData = useLoaderData();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
            margin={2}
        >
            <Typography variant="h3">Quizzes</Typography>
            {loaderData.length === 0 && (
                <Typography variant="body1">
                    There is no any quiz yet...
                </Typography>
            )}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                {loaderData.map((quiz, index) => (
                    <Link
                        underline="none"
                        key={index}
                        to={`/quiz/${quiz._id}`}
                        component={RouterLink}
                    >
                        <Button>{quiz.title}</Button>
                    </Link>
                ))}
            </Box>
        </Box>
    );
};

export const loader = async () => {
    const { payload } = await QuizService.getAllQuizzes();

    return payload;
};

export default Quizzes;
