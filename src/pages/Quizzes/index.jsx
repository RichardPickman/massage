import { Box, Button, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getAllQuizzes } from '../../http/quizApi';

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                const { data } = await getAllQuizzes();
                setQuizzes([...data.payload]);
            } catch (e) {
                alert(e.message);
            }
        }

        fetchQuizzes();
    }, []);

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
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                {quizzes.map((quiz, index) => (
                    <Link
                        underline="none"
                        key={index}
                        to={`/quizzes/${quiz._id}`}
                        component={RouterLink}
                    >
                        <Button>{quiz.title}</Button>
                    </Link>
                ))}
            </Box>
        </Box>
    );
};

export default Quizzes;
