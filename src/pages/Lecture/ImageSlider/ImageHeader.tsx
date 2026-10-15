import { ArrowSquareOutIcon, XIcon } from '@phosphor-icons/react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { useAppDispatch, useAppSelector } from '../../../store';
import { finish } from '../../../store/reducers/images';

export const ImageHeader = memo(() => {
    const images = useAppSelector((state) => state.images);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    if (!images.showMenus) {
        return null;
    }

    const handleClose = () => {
        dispatch(finish());
        navigate('/lectures');
    };

    return (
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-black/50 p-2 text-white">
            <p className="text-sm">
                {images.currentIndex + 1} / {images.slides.length}
            </p>
            <div className="flex items-center gap-1">
                {images.currentImage ? (
                    <Button variant="ghost" size="icon-sm" asChild>
                        <a
                            href={images.currentImage}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Open image in a new tab"
                        >
                            <ArrowSquareOutIcon />
                        </a>
                    </Button>
                ) : null}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close the slider"
                    onClick={handleClose}
                >
                    <XIcon />
                </Button>
            </div>
        </div>
    );
});

