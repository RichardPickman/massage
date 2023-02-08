import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useContext } from 'react';
import { ThemeContext } from '../../../components/ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';
import { jumpToSlide } from '../../../store/reducers/images';

const ImageFooter = () => {
    const images = useSelector((state) => state.images);
    const dispatch = useDispatch();

    const setSlide = (index) => dispatch(jumpToSlide(index));

    const theme = useContext(ThemeContext);

    return (
        images.showMenus && (
            <Box
                display="flex"
                sx={{
                    width: '100%',
                    position: 'absolute',
                    p: 1,
                    gap: 1,
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
                    {images.slides.map((img, index) => (
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
                                    images.currentIndex === index ? 1 : 0.5,
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
