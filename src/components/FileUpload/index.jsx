import { Button, Typography, Box, IconButton, Stack } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';

const FileUpload = ({ image, removeImage, handleImage }) => {
    const [clicked, setClicked] = useState(false);

    const onClick = () => setClicked(!clicked);

    return !image ? (
        <Button variant="contained" component="label">
            Upload File
            <input type="file" hidden onChange={handleImage} />
        </Button>
    ) : (
        <Box
            display="flex"
            width="60%"
            justifyContent="space-around"
            alignSelf="center"
            alignItems="center"
            gap={1}
            margin={1}
            padding={0.5}
        >
            <ImageOutlinedIcon />
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <Box
                    component="img"
                    onClick={onClick}
                    sx={{
                        width: clicked ? 300 : 100,
                        height: clicked ? 225 : 75,
                        objectFit: 'contain',
                    }}
                    src={image}
                />
                <Typography variant="body">{image.name}</Typography>
            </Box>
            <IconButton onClick={removeImage} color="error">
                <DeleteOutlineOutlinedIcon />
            </IconButton>
        </Box>
    );
};

export default memo(FileUpload);

FileUpload.propTypes = {
    image: PropTypes.object,
    removeImage: PropTypes.func,
    handleImage: PropTypes.func,
};
