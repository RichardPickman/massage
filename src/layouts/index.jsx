import React from 'react';
import Header from '../components/Header';

import { Box } from '@mui/material';

import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <Box display="flex" flexDirection="column" margin={2}>
            <Header />
            <Outlet />
        </Box>
    );
}

export default Layout;
