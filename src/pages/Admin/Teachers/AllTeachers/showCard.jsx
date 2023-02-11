import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { imageURL } from '../../../../utils/consts';

function Card({ teacher }) {
    const image = teacher.img ? teacher.img : imageURL;

    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h5">
                {teacher.firstName} {teacher.lastName}
            </Typography>
            <Box display="flex" gap={2}>
                <Box
                    sx={{
                        borderRadius: '50%',
                        width: '110px',
                        height: '110px',
                    }}
                    component="img"
                    src={image}
                />
                <Box
                    display="flex"
                    alignItems="start"
                    justifyContent="space-around"
                    gap={1}
                    width="80%"
                >
                    <Stack direction="column" spacing={1} alignItems="start">
                        <Typography variant="caption">Email:</Typography>
                        <Typography variant="body1" color="#71aaeb" noWrap>
                            {teacher.email}
                        </Typography>
                    </Stack>
                    <Stack direction="column" spacing={1}>
                        <Typography variant="caption">Lessons:</Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {teacher.lessons.map((lesson) => (
                                <Typography key={lesson.id} variant="body1">
                                    {lesson.title}
                                </Typography>
                            ))}
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

Card.propTypes = {
    teacher: PropTypes.object,
};

export default Card;
