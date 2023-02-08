import { Container } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <Container maxWidth="md">
            <Outlet />
        </Container>
    );
};

export default Layout;

Layout.propTypes = {
    children: PropTypes.element,
};
