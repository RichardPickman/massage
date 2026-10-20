import {
    ArrowsInIcon,
    ArrowsOutIcon,
    ArrowSquareOutIcon,
    XIcon,
} from '@phosphor-icons/react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { useAppDispatch, useAppSelector } from '../../../store';
import { finish } from '../../../store/reducers/images';

interface ImageHeaderProps {
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
}

// The bar sits on top of a photo, so the default ghost hover (a light muted
// surface) would wash the icons out.
const barButton =
    'text-white hover:bg-white/15! hover:text-white! active:translate-y-0!';

export const ImageHeader = memo(
    ({ isFullscreen, onToggleFullscreen }: ImageHeaderProps) => {
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
                    {images.slides.length > 0
                        ? `${images.currentIndex + 1} / ${images.slides.length}`
                        : 'No images'}
                </p>
                <div className="flex items-center gap-1">
                    {images.currentImage ? (
                        <Button variant="ghost" size="icon-sm" asChild>
                            <a
                                href={images.currentImage}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Open image in a new tab"
                                className={barButton}
                            >
                                <ArrowSquareOutIcon />
                            </a>
                        </Button>
                    ) : null}
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={
                            isFullscreen
                                ? 'Exit fullscreen'
                                : 'View in fullscreen'
                        }
                        onClick={onToggleFullscreen}
                        className={barButton}
                    >
                        {isFullscreen ? <ArrowsInIcon /> : <ArrowsOutIcon />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Close the slider"
                        onClick={handleClose}
                        className={barButton}
                    >
                        <XIcon />
                    </Button>
                </div>
            </div>
        );
    }
);

ImageHeader.displayName = 'ImageHeader';
