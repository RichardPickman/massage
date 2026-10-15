import { useDrag } from 'react-dnd';
import { Card } from '../../../components/ui/card';

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
    return <Card ref={drag}>{children}</Card>;
}

export default DragItem;
