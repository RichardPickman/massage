import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card } from '../../../components/ui/card';
import itemTypes from '../../../utils/itemTypes';

function SortableTechnicItem({
    children,
    accept,
    technic,
    index,
    moveTechnic,
}) {
    const ref = useRef(null);
    const [_, drop] = useDrop({
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
    const [__, drag] = useDrag({
        type: itemTypes.BOX,
        item: () => ({ technic, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return <Card>{children}</Card>;
}

export default SortableTechnicItem;
