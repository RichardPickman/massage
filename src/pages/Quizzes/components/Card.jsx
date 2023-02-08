import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import Link from '../../../components/Link';
import PropTypes from 'prop-types';
import { Stack } from '@mui/system';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRemove } from '../../../store/reducers/quizzes/fetch';

function Card({ quiz, beers, index }) {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleDelete = async () => {
        dispatch(fetchRemove({ id: quiz._id }));
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="left" gap={2}>
            <Box component="img" borderRadius="5px" src={quiz.image} />
            <Box
                display="flex"
                flexDirection="column"
                gap={1}
                justifyContent="space-between"
            >
                <Link to={`/quiz/${quiz._id}`}>
                    <Typography variant="h5">{quiz.title}</Typography>
                </Link>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="body1">
                        {quiz.author.nickname
                            ? quiz.author.nickname
                            : beers[index]}
                    </Typography>
                    {quiz.author._id === user.id && (
                        <IconButton color="error" onClick={handleDelete}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    )}
                </Stack>
            </Box>
        </Box>
    );
}

Card.propTypes = {
    quiz: PropTypes.object,
    beers: PropTypes.array,
    index: PropTypes.number,
};

export default Card;
