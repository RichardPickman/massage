import React from 'react';

import { Box } from '@mui/material';

import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';

function QuizLayout() {
    const { innerWidth } = window;

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            margin={2}
            gap={2}
        >
            <Header />
            <Box width={innerWidth > 500 ? '50%' : '100%'}>
                <Outlet />
            </Box>
        </Box>
    );
}

export default QuizLayout;
