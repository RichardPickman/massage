import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function LectureLayout() {
    return (
        <Box>
            <Outlet />
        </Box>
    );
}
