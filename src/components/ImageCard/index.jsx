import { Box, IconButton } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

function ImageCard({ remove, img }) {
    const [clicked, setClicked] = useState(false);

    const onClick = () => setClicked(!clicked);

    return (
        <Box position="relative">
            <IconButton
                onClick={() => remove()}
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }}
            >
                <DeleteOutlineOutlinedIcon color="error" />
            </IconButton>
            <Box
                component="img"
                onClick={onClick}
                sx={{
                    width: clicked ? 300 : 100,
                    height: clicked ? 225 : 75,
                    objectFit: 'contain',
                }}
                src={img}
            />
        </Box>
    );
}

export default ImageCard;

ImageCard.propTypes = {
    remove: PropTypes.func,
    img: PropTypes.string,
};
