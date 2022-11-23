import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useContext } from 'react';
import { ImagesContext } from '../../../context/images';
import { ThemeContext } from '../../../components/ThemeProvider';

const ImageFooter = () => {
    const [imagesState, dispatch] = useContext(ImagesContext);

    const setSlide = (index) =>
        dispatch({ type: 'jump_to_slide', payload: index });

    const theme = useContext(ThemeContext);

    return (
        imagesState.showMenus && (
            <Box
                display="flex"
                padding={1}
                gap={1}
                sx={{
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    overflow: 'hidden',
                    backgroundColor: theme.darkEnabled
                        ? 'rgb(0, 0, 0)'
                        : 'rgb(255, 255, 255)',
                }}
            >
                <Box
                    display="flex"
                    gap={1}
                    sx={{
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                    }}
                >
                    {imagesState.slides.map((img, index) => (
                        <Box
                            key={index}
                            component="img"
                            loading="lazy"
                            onClick={() => setSlide(index)}
                            sx={{
                                width: 150,
                                height: 75,
                                borderRadius: 2,
                                aspectRatio: 16 / 9,
                                opacity:
                                    imagesState.currentIndex === index
                                        ? 1
                                        : 0.5,
                            }}
                            src={img}
                        />
                    ))}
                </Box>
            </Box>
        )
    );
};

export default memo(ImageFooter);

ImageFooter.propTypes = {
    slides: PropTypes.array,
    dumbState: PropTypes.object,
    currentIndex: PropTypes.number,
};
