import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import { finish, nextSlide, prevSlide } from '../../../store/reducers/images';
import { ImageFooter } from './ImageFooter';
import { ImageHeader } from './ImageHeader';
import { MainImage } from './MainImage';

export const ImageSlider = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            );
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                dispatch(prevSlide());
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                dispatch(nextSlide());
            }

            // The first Escape leaves browser fullscreen; the second closes
            // the viewer.
            if (event.key === 'Escape' && !document.fullscreenElement) {
                dispatch(finish());
                navigate('/lectures');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dispatch, navigate]);

    const toggleFullscreen = async () => {
        const element = containerRef.current;

        if (!element) {
            return;
        }

        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();

                return;
            }

            await element.requestFullscreen();
        } catch {
            // The browser can refuse fullscreen; the viewer already fills the
            // viewport, so there is nothing else to do.
            return;
        }
    };

    return (
        <div
            ref={containerRef}
            aria-label="Lecture images"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
        >
            <ImageHeader
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
            />
            <MainImage />
            <ImageFooter />
        </div>
    );
};
