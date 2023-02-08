import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import React, { memo, useRef } from 'react';
import itemTypes from '../../../utils/itemTypes';
import { useDrag, useDrop } from 'react-dnd';

function SortableTechnicItem({
    children,
    accept,
    technic,
    index,
    moveTechnic,
}) {
    const ref = useRef(null);
    const [{ handlerId, isOver, isOverCurrent }, drop] = useDrop({
        accept,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveTechnic(dragIndex, hoverIndex);

            item.index = hoverIndex;
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: itemTypes.BOX,
        item: () => ({ technic, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <Box ref={ref} display="flex" width="100%">
            {children}
        </Box>
    );
}

export default SortableTechnicItem;

SortableTechnicItem.propTypes = {
    children: PropTypes.node,
    accept: PropTypes.array,
    moveTechnic: PropTypes.func,
    technic: PropTypes.object,
    index: PropTypes.number,
};
