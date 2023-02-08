import React, { memo } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

function AnimatedList({ children, ...props }) {
    const [listRef] = useAutoAnimate();

    return (
        <Box ref={listRef} {...props}>
            {children}
        </Box>
    );
}

AnimatedList.propTypes = {
    children: PropTypes.node.isRequired,
};

export default memo(AnimatedList);
