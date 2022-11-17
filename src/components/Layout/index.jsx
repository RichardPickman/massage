import { Container } from '@mui/material';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { LayoutContext } from '../../context/layout';

const Layout = ({ children }) => {
    const [layoutState, dispatch] = useContext(LayoutContext);

    return layoutState.layoutShown ? (
        <Container maxWidth="md">{children}</Container>
    ) : (
        children
    );
};

export default Layout;

Layout.propTypes = {
    children: PropTypes.element,
};
