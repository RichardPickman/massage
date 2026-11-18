import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import { finish, nextSlide, prevSlide } from '../../../store/reducers/images';
import { readLectureListUrl } from '../../../utils/lectureList';
import { ImageFooter } from './ImageFooter';
import { ImageHeader } from './ImageHeader';
import { MainImage } from './MainImage';

export const ImageSlider = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();
    const listUrl = readLectureListUrl(state);

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

    // The viewer is its own screen. Without this the document underneath keeps
    // scrolling behind the fixed overlay, so a swipe drags the page instead of
    // leaving the slide where it is.
    useEffect(() => {
        const { body, documentElement } = document;
        const previous = {
            body: body.style.overflow,
            documentElement: documentElement.style.overflow,
        };

        body.style.overflow = 'hidden';
        documentElement.style.overflow = 'hidden';

        return () => {
            body.style.overflow = previous.body;
            documentElement.style.overflow = previous.documentElement;
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
                navigate(listUrl);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dispatch, listUrl, navigate]);

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
            className="fixed inset-x-0 top-0 z-50 flex h-dvh items-center justify-center overflow-hidden overscroll-none bg-black"
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
