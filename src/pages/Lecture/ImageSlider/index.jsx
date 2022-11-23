import React from 'react';

import { Box } from '@mui/material';

import ImageHeader from './ImageHeader';
import MainImage from './MainImage';
import ImageFooter from './ImageFooter';

const ImageSlider = () => {
    return (
        <Box position="relative" height="100%" width="100%">
            <ImageHeader />
            <MainImage />
            <ImageFooter />
        </Box>
    );
};

export default ImageSlider;
