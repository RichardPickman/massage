import { Box, Typography } from '@mui/material';
import React from 'react';
import { useRouteError } from 'react-router-dom';

function Error() {
    const error = useRouteError();

    return (
        <Box>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="left"
                marginTop={25}
                gap={2}
            >
                <Typography variant="h3">Oops!</Typography>
                <Typography variant="h4">
                    Sorry, an unexpected error has occurred.
                </Typography>
                <Typography variant="body1">{error.message}</Typography>
            </Box>
        </Box>
    );
}

export default Error;
