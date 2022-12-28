import {
    Button,
    Typography,
    Box,
    IconButton,
    Stack,
    Dialog,
} from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';

const FileUpload = ({ image, removeImage, handleImage, text }) => {
    const [clicked, setClicked] = useState(false);

    const onClick = () => setClicked(!clicked);

    return !image ? (
        <Button variant="outlined" component="label">
            Upload File
            <input type="file" hidden onChange={handleImage} />
        </Button>
    ) : (
        <Box
            display="flex"
            justifyContent="space-between"
            alignSelf="center"
            alignItems="center"
            gap={2}
        >
            <ImageOutlinedIcon />
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <Button onClick={onClick}>{text}</Button>
                <Typography variant="body">{image.name}</Typography>
            </Box>
            <IconButton onClick={removeImage} color="error">
                <DeleteOutlineOutlinedIcon />
            </IconButton>
            <Dialog onClick={() => setClicked(false)} open={clicked}>
                <Box component="img" onClick={onClick} src={image} />
            </Dialog>
        </Box>
    );
};

export default memo(FileUpload);

FileUpload.propTypes = {
    image: PropTypes.string,
    removeImage: PropTypes.func,
    handleImage: PropTypes.func,
    text: PropTypes.string,
};
