import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { memo } from 'react';
import { Card } from '../ui/card';

function AnimatedList({ children, ...props }) {
    const [listRef] = useAutoAnimate();

    return (
        <Card ref={listRef} {...props}>
            {children}
        </Card>
    );
}

export default memo(AnimatedList);
