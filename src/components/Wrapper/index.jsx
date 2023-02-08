import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

import Header from '../../components/Header';

function Wrapper({ children }) {
    return (
        <Box display="flex" flexDirection="column">
            <Header />
            {children}
        </Box>
    );
}

Wrapper.propTypes = {
    children: PropTypes.node,
};

export default Wrapper;
