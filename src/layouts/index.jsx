import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Wrapper from '../components/Wrapper';

function Layout() {
    return (
        <Wrapper>
            <Box display="flex" flexDirection="column">
                <Outlet />
            </Box>
        </Wrapper>
    );
}

export default Layout;
