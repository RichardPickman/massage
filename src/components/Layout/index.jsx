import { Container } from '@mui/material';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { LayoutContext } from '../../context/layout';
import Header from '../Header';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
    const [layoutState, dispatch] = useContext(LayoutContext);

    return layoutState.layoutShown ? (
        <>
            <Header />
            <Container maxWidth="md">
                <Outlet />
            </Container>
        </>
    ) : (
        <Outlet />
    );
};

export default Layout;

Layout.propTypes = {
    children: PropTypes.element,
};
