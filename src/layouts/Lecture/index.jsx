import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Wrapper from '../../components/Wrapper';

export default function LecturesLayout() {
    const { innerWidth } = window;

    return (
        <Wrapper>
            <Box display="flex" justifyContent="center" alignItems="center">
                <Box width={innerWidth >= 1000 ? '50%' : '100%'}>
                    <Outlet />
                </Box>
            </Box>
        </Wrapper>
    );
}
