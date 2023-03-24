import { useCallback } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import ImageCard from '../../../../components/ImageCard';
/* eslint-disable react/react-in-jsx-scope */


export const ImageList = ({ images, setImages }) => {
    const [listRef] = useAutoAnimate();

    const moveImage = useCallback(
        (dragIndex, hoverIndex) =>
            setImages((prevImages) =>
                update(prevImages, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevImages[dragIndex]],
                    ],
                })
            ),
        []
    );

    return (
        <Grid container justifyContent="left" spacing={2} ref={listRef}>
            {images.map((img, index) => (
                <Grid item key={img.id} xs={6} sm={4} md={3}>
                    <ImageCard
                        remove={() =>
                            setImages((prev) =>
                                prev.filter((item) => item.id !== img.id)
                            )
                        }
                        img={window.URL.createObjectURL(img.file)}
                        text={img.file.name}
                        index={index}
                        moveImage={moveImage}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

ImageList.propTypes = {
    images: PropTypes.array,
    setImages: PropTypes.func,
};
