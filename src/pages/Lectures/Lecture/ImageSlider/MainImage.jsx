import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

import { Box, IconButton } from '@mui/material';
import { ImagesContext } from '../../../../context/images';
import { useState } from 'react';
import { useEffect } from 'react';

const MainImage = () => {
    const [imagesState, dispatch] = useContext(ImagesContext);
    const [showMenu, setShowMenu] = useState(true);

    const nextImage = useCallback(
        () => dispatch({ type: 'next_slide' }),
        [dispatch]
    );
    const prevImage = useCallback(
        () => dispatch({ type: 'prev_slide' }),
        [dispatch]
    );

    useEffect(
        () => dispatch({ type: 'handle_menus', payload: showMenu }),
        [showMenu]
    );

    const handleMenu = () => setShowMenu(!showMenu);

    return (
        <Box display="flex" width="100%" flexDirection="column">
            <IconButton
                disabled={imagesState.currentIndex === 0}
                onClick={prevImage}
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
                disabled={
                    imagesState.currentIndex === imagesState.slides.length - 1
                }
                onClick={nextImage}
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
                src={imagesState.currentImage}
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
