import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function LecturesLayout() {
    const { innerWidth } = window;

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            margin={2}
        >
            <Box width={innerWidth > 720 ? '50%' : '100%'}>
                <Outlet />
            </Box>
        </Box>
    );
}
