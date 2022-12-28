import React from 'react';
import { Box } from '@mui/material';
import { memo } from 'react';
import { useDrop } from 'react-dnd';
import PropTypes from 'prop-types';

export const DropTarget = memo(function DropTarget({
    accept,
    onDrop,
    children,
}) {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: accept,
        drop: onDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <Box width="100%" ref={drop}>
            {children}
        </Box>
    );
});

DropTarget.propTypes = {
    accept: PropTypes.array,
    onDrop: PropTypes.func,
    children: PropTypes.node,
};
