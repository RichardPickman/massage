import React from 'react';

import { Box, Container } from '@mui/material';

import { Outlet } from 'react-router-dom';

function Layout() {
    const { innerWidth } = window;

    if (innerWidth >= 1680) {
        return (
            <Container maxWidth="lg">
                <Box margin={2}>
                    <Outlet />
                </Box>
            </Container>
        );
    }

    if (innerWidth <= 1680 && innerWidth >= 768) {
        return (
            <Container maxWidth="md">
                <Box margin={2}>
                    <Outlet />
                </Box>
            </Container>
        );
    }

    if (innerWidth <= 768 && innerWidth >= 360) {
        return (
            <Container maxWidth="lg">
                <Box margin={2}>
                    <Outlet />
                </Box>
            </Container>
        );
    }
}

export default Layout;
