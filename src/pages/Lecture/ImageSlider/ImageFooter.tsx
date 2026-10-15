import { cn } from 'cn';
import { memo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { jumpToSlide } from '../../../store/reducers/images';

export const ImageFooter = memo(() => {
    const images = useAppSelector((state) => state.images);
    const dispatch = useAppDispatch();

    if (!images.showMenus || images.slides.length === 0) {
        return null;
    }

    return (
        <div className="absolute inset-x-0 bottom-0 z-20 flex gap-1 overflow-x-auto bg-black/60 p-2">
            {images.slides.map((slide, index) => (
                <img
                    key={`${index}-${slide}`}
                    src={slide}
                    alt={`Slide ${index + 1}`}
                    loading="lazy"
                    onClick={() => dispatch(jumpToSlide(index))}
                    className={cn(
                        'h-16 w-28 shrink-0 cursor-pointer object-cover transition-opacity',
                        images.currentIndex === index
                            ? 'opacity-100 ring-2 ring-primary'
                            : 'opacity-50 hover:opacity-80'
                    )}
                />
            ))}
        </div>
    );
});

