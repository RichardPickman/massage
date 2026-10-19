import { ImageFooter } from './ImageFooter';
import { ImageHeader } from './ImageHeader';
import { MainImage } from './MainImage';

export const ImageSlider = () => {
    return (
        <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black/40">
            <ImageHeader />
            <MainImage />
            <ImageFooter />
        </div>
    );
};

