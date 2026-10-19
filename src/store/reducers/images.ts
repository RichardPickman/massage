import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ImagesState {
    slides: string[];
    currentIndex: number;
    currentImage: string;
    showMenus: boolean;
}

const initialState: ImagesState = {
    slides: [],
    currentIndex: 0,
    currentImage: '',
    showMenus: true,
};

const imagesSlice = createSlice({
    name: 'images',
    initialState: initialState,
    reducers: {
        setImages: (state, action: PayloadAction<string[]>) => {
            state.slides = action.payload;
            state.currentIndex = 0;
            state.currentImage = action.payload[0] ?? '';
        },
        finish: () => {
            return initialState;
        },
        nextSlide: (state) => {
            if (state.currentIndex >= state.slides.length - 1) {
                return;
            }

            state.currentIndex += 1;
            state.currentImage = state.slides[state.currentIndex];
        },
        prevSlide: (state) => {
            if (state.currentIndex <= 0) {
                return;
            }

            state.currentIndex -= 1;
            state.currentImage = state.slides[state.currentIndex];
        },
        jumpToSlide: (state, action: PayloadAction<number>) => {
            const slide = state.slides[action.payload];

            if (!slide) {
                return;
            }

            state.currentIndex = action.payload;
            state.currentImage = slide;
        },
        handleMenus: (state, action: PayloadAction<boolean>) => {
            state.showMenus = action.payload;
        },
    },
});

export const {
    setImages,
    finish,
    jumpToSlide,
    nextSlide,
    prevSlide,
    handleMenus,
} = imagesSlice.actions;

export default imagesSlice.reducer;
