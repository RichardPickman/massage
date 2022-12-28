import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

import Wrapper from '../../components/Wrapper';

function Layout() {
    const { innerWidth } = window;

    if (innerWidth >= 1680) {
        return (
            <Wrapper>
                <Container maxWidth="lg">
                    <Box>
                        <Outlet />
                    </Box>
                </Container>
            </Wrapper>
        );
    }

    if (innerWidth <= 1680 && innerWidth >= 768) {
        return (
            <Wrapper>
                <Container maxWidth="md">
                    <Box>
                        <Outlet />
                    </Box>
                </Container>
            </Wrapper>
        );
    }

    if (innerWidth <= 768 && innerWidth >= 360) {
        return (
            <Wrapper>
                <Container maxWidth="lg">
                    <Box>
                        <Outlet />
                    </Box>
                </Container>
            </Wrapper>
        );
    }
}

export default Layout;
