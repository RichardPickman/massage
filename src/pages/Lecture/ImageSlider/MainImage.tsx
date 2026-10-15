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
                className="absolute top-1/2 left-0 z-20 -translate-y-1/2"
            >
                <CaretLeftIcon className="size-8" />
            </Button>
            <img
                src={images.currentImage}
                alt={`Lecture image ${images.currentIndex + 1}`}
                onClick={() => dispatch(handleMenus(!images.showMenus))}
                className="max-h-[80vh] max-w-full object-contain"
            />
            <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Next image"
                disabled={images.currentIndex === images.slides.length - 1}
                onClick={() => dispatch(nextSlide())}
                className="absolute top-1/2 right-0 z-20 -translate-y-1/2"
            >
                <CaretRightIcon className="size-8" />
            </Button>
        </div>
    );
};

