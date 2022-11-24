import React from 'react';

import { Box } from '@mui/material';

import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';

function QuizLayout() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            margin={2}
        >
            <Header />
            <Box width="50%">
                <Outlet />
            </Box>
        </Box>
    );
}

export default QuizLayout;
