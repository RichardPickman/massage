import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function CustomLink({ to, children }) {
    return (
        <Link underline="none" to={to} component={RouterLink}>
            {children}
        </Link>
    );
}

CustomLink.propTypes = {
    to: PropTypes.string,
    children: PropTypes.node,
};

export default CustomLink;
