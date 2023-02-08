import React from 'react';

import { Box } from '@mui/material';

import { Outlet } from 'react-router-dom';
import Wrapper from '../../components/Wrapper';

function QuizLayout() {
    const contentWidth = window.innerWidth;

    return (
        <Wrapper>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap={2}
            >
                <Box width={contentWidth >= 768 ? '70%' : '100%'}>
                    <Outlet />
                </Box>
            </Box>
        </Wrapper>
    );
}

export default QuizLayout;
