import React from 'react';
import PropTypes from 'prop-types';

import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

import { Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    prevSlide,
    handleMenus,
    nextSlide,
} from '../../../store/reducers/images';

const MainImage = () => {
    const images = useSelector((state) => state.images);
    const dispatch = useDispatch();

    const handleMenu = () => dispatch(handleMenus(!images.showMenus));

    return (
        <Box display="flex" width="100%" flexDirection="column">
            <IconButton
                disabled={images.currentIndex === 0}
                onClick={() => dispatch(prevSlide())}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translate(0, -50%)',
                    left: 0,
                    zIndex: 2,
                }}
            >
                <KeyboardArrowLeftOutlinedIcon sx={{ width: 50, height: 50 }} />
            </IconButton>
            <IconButton
                disabled={images.currentIndex === images.slides.length - 1}
                onClick={() => dispatch(nextSlide())}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translate(0, -50%)',
                    right: 0,
                    zIndex: 2,
                }}
            >
                <KeyboardArrowRightOutlinedIcon
                    sx={{ width: 50, height: 50 }}
                />
            </IconButton>
            <Box
                component="img"
                onClick={handleMenu}
                sx={{
                    position: 'absolute',
                    maxHeight: innerHeight,
                    maxWidth: innerWidth,
                    height: '100%',
                    objectFit: 'contain',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
                src={images.currentImage}
            />
        </Box>
    );
};

export default MainImage;

MainImage.propTypes = {
    image: PropTypes.string,
    setIndex: PropTypes.number,
    currentIndex: PropTypes.number,
    arrayLenght: PropTypes.number,
};
