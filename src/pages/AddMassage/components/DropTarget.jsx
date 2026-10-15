import React, { memo } from 'react';
import { useDrop } from 'react-dnd';
import { Card } from '../../../components/ui/card';

export const DropTarget = memo(function DropTarget({
    accept,
    onDrop,
    children,
}) {
    const [_, drop] = useDrop({
        accept: accept,
        drop: onDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return <Card>{children}</Card>;
});
