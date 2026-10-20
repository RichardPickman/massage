import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { Button } from '../../../components/ui/button';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
    handleMenus,
    nextSlide,
    prevSlide,
} from '../../../store/reducers/images';

export const MainImage = () => {
    const images = useAppSelector((state) => state.images);
    const dispatch = useAppDispatch();

    if (images.slides.length === 0) {
        return (
            <p className="text-muted-foreground">This lecture has no images.</p>
        );
    }

    return (
        <div className="relative flex h-full w-full items-center justify-center">
            <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Previous image"
                disabled={images.currentIndex === 0}
                onClick={() => dispatch(prevSlide())}
                className="absolute inset-y-0 left-3 z-20 my-auto rounded-full bg-black/40 text-white hover:bg-black/70! hover:text-white! active:translate-y-0!"
            >
                <CaretLeftIcon className="size-7" />
            </Button>
            <img
                src={images.currentImage}
                alt={`Lecture image ${images.currentIndex + 1}`}
                draggable={false}
                onClick={() => dispatch(handleMenus(!images.showMenus))}
                className="max-h-[85vh] max-w-full object-contain select-none"
            />
            <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Next image"
                disabled={images.currentIndex === images.slides.length - 1}
                onClick={() => dispatch(nextSlide())}
                className="absolute inset-y-0 right-3 z-20 my-auto rounded-full bg-black/40 text-white hover:bg-black/70! hover:text-white! active:translate-y-0!"
            >
                <CaretRightIcon className="size-7" />
            </Button>
        </div>
    );
};
