import { Box, Button, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useLoaderData } from 'react-router-dom';
import React, { useLayoutEffect } from 'react';
import QuizService from '../../services/Quiz';
import { useDispatch, useSelector } from 'react-redux';
import RandomData from '../../services/RandomData';
import Card from './components/Card';
import { setQuizzes } from '../../store/reducers/quizzes';

const Quizzes = () => {
    const loaderData = useLoaderData();

    const { isAuth } = useSelector((state) => state.auth);
    const { quizzes } = useSelector((state) => state.quizzes);

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setQuizzes(loaderData.quiz));
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
        >
            <Box display="flex" justifyContent="space-around" width="40%">
                <Typography variant="h4">Quizzes</Typography>
                {isAuth && (
                    <Link
                        underline="none"
                        to={'constructor'}
                        component={RouterLink}
                    >
                        <Button variant="outlined">Add quiz</Button>
                    </Link>
                )}
            </Box>
            {loaderData.quiz.length === 0 ? (
                <Typography variant="body1">
                    There is no any quiz yet...
                </Typography>
            ) : (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexWrap="wrap"
                    mt={2}
                    gap={2}
                >
                    {quizzes.map((quiz, index) => (
                        <Card
                            key={quiz._id}
                            index={index}
                            quiz={quiz}
                            beers={loaderData.beers}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export const loader = async () => {
    const { payload } = await QuizService.getAllQuizzes();
    const beer = await RandomData.getBeer(payload.length || 0);

    if (Array.isArray(beer)) {
        return { quiz: payload, beers: beer.map((item) => item.style) };
    }

    return { quiz: payload, beers: [beer.style] };
};

export default Quizzes;
