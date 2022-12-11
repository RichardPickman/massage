import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    slides: [],
    currentIndex: 0,
    currentImage: '',
    showMenus: true,
};

const imagesSlice = createSlice({
    name: 'images',
    initialState: initialState,
    reducers: {
        setImages: (state, action) => {
            state.slides = action.payload;
            state.currentImage = action.payload[0];
        },
        finish: () => {
            return initialState;
        },
        nextSlide: (state) => {
            state.currentIndex += 1;
            state.currentImage = state.slides[state.currentIndex];
        },
        prevSlide: (state) => {
            state.currentIndex = state.currentIndex - 1;
            state.currentImage = state.slides[state.currentIndex];
        },
        jumpToSlide: (state, action) => {
            state.currentIndex = action.payload;
        },
        handleMenus: (state, action) => {
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
