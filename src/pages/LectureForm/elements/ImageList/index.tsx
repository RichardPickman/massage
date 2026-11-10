import { useAutoAnimate } from '@formkit/auto-animate/react';
import update from 'immutability-helper';
import { type Dispatch, type SetStateAction, useCallback } from 'react';
import { ImageCard } from '../../../../components/ImageCard';
import type { StagedImage } from '../../helpers';

interface ImageListProps {
    images: StagedImage[];
    setImages: Dispatch<SetStateAction<StagedImage[]>>;
}

export const ImageList = ({ images, setImages }: ImageListProps) => {
    const [listRef] = useAutoAnimate();

    const moveImage = useCallback(
        (dragIndex: number, hoverIndex: number) =>
            setImages((prevImages) =>
                update(prevImages, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevImages[dragIndex]],
                    ],
                })
            ),
        [setImages]
    );

    const removeImage = (id: string) =>
        setImages((prevImages) => {
            const removed = prevImages.find((image) => image.id === id);

            if (removed) {
                window.URL.revokeObjectURL(removed.preview);
            }

            return prevImages.filter((image) => image.id !== id);
        });

    return (
        <div ref={listRef} className="flex flex-wrap gap-2">
            {images.map((image, index) => (
                <ImageCard
                    key={image.id}
                    remove={() => removeImage(image.id)}
                    img={image.preview}
                    text={image.file.name}
                    index={index}
                    moveImage={moveImage}
                />
            ))}
        </div>
    );
};
