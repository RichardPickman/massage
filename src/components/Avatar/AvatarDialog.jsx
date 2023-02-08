import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

function AvatarDialog({ onClose, open, onChange }) {
    const [image, setImage] = useState(null);

    const handleUpload = (e) => setImage(e.target.files[0]);

    const handleSave = () => onChange(image);

    const handleClose = () => {
        onClose();
        setImage(null);
    };

    const handleImageRemove = () => setImage(null);

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                Upload new photo
                <IconButton onClick={handleClose} size="small">
                    <CloseOutlinedIcon size="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 2,
                    gap: 2,
                    mb: 2,
                }}
            >
                <Typography variant="body1">
                    You can upload an image in JPG or PNG format.
                </Typography>
                {image ? (
                    <Box
                        sx={{
                            objectFit: 'cover',
                            borderRadius: '50%',
                            width: '200px',
                            height: '200px',
                        }}
                        component="img"
                        src={window.URL.createObjectURL(image)}
                    />
                ) : (
                    <Button variant="contained" component="label">
                        Upload
                        <input
                            hidden
                            onChange={handleUpload}
                            accept="image/png, image/jpeg"
                            multiple
                            type="file"
                        />
                    </Button>
                )}
            </DialogContent>
            {image && (
                <DialogActions
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    <Button variant="outlined" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="outlined" onClick={handleImageRemove}>
                        Return
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}

AvatarDialog.propTypes = {
    onClose: PropTypes.func,
    onChange: PropTypes.func,
    open: PropTypes.bool,
};

export default AvatarDialog;
