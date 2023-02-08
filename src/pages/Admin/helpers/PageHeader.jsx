import { Box, Typography } from '@mui/material';
import React from 'react';
import { PropTypes } from 'prop-types';

function PageHeader({ title, description }) {
    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h3">{title}</Typography>
            <Typography variant="body1" color="#71aaeb">
                {description}
            </Typography>
        </Box>
    );
}

PageHeader.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
};

export default PageHeader;
