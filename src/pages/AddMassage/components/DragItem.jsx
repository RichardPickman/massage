import { Box } from '@mui/material';
import React from 'react';
import { useDrag } from 'react-dnd';
import PropTypes from 'prop-types';

function DragItem({ item, type, children }) {
    const [_, drag] = useDrag(
        () => ({
            type,
            item,
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.4 : 1,
            }),
        }),
        [item, type]
    );
    return <Box ref={drag}>{children}</Box>;
}

export default DragItem;

DragItem.propTypes = {
    item: PropTypes.object,
    type: PropTypes.string,
    isDropped: PropTypes.bool,
    children: PropTypes.node,
};
