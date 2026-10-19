import { TrashIcon } from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { itemTypes } from '../../utils/itemTypes';

interface DragItem {
    text: string;
    index: number;
}

interface ImageCardProps {
    img: string;
    text: string;
    index: number;
    remove: () => void;
    moveImage: (dragIndex: number, hoverIndex: number) => void;
}

export const ImageCard = ({
    remove,
    img,
    text,
    index,
    moveImage,
}: ImageCardProps) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: string | symbol | null }
    >({
        accept: itemTypes.CARD,
        collect: (monitor) => ({
            handlerId: monitor.getHandlerId(),
        }),
        hover: (item, monitor) => {
            const element = ref.current;
            const clientOffset = monitor.getClientOffset();

            if (!element || !clientOffset) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = element.getBoundingClientRect();
            const hoverMiddleX =
                (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
            const hoverClientX = clientOffset.x - hoverBoundingRect.left;

            if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
                return;
            }

            moveImage(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag<
        DragItem,
        void,
        { isDragging: boolean }
    >({
        type: itemTypes.CARD,
        item: () => ({ text, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            data-handler-id={handlerId}
            className="w-40 cursor-grab"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <Card className="gap-1 p-1">
                <img
                    src={img}
                    alt={text}
                    onClick={() => setIsPreviewOpen(true)}
                    className="h-24 w-full object-cover"
                />
                <div className="flex items-center justify-between gap-1 px-1">
                    <p className="truncate text-xs text-muted-foreground">
                        {text}
                    </p>
                    <Button
                        size="icon-xs"
                        variant="ghost"
                        aria-label={`Remove ${text}`}
                        onClick={() => remove()}
                    >
                        <TrashIcon />
                    </Button>
                </div>
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogTitle className="sr-only">{text}</DialogTitle>
                        <img
                            src={img}
                            alt={text}
                            className="w-full object-contain"
                        />
                    </DialogContent>
                </Dialog>
            </Card>
        </div>
    );
};

