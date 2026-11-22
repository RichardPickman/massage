import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

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

    // The viewer is its own screen: the page underneath must not scroll behind
    // it. data-page-scroll-lock is what the stylesheet keys that lock off, so
    // the lock follows this element in and out of the tree.
    return (
        <div
            ref={containerRef}
            aria-label={t('lectures.viewer.label')}
            data-page-scroll-lock
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
