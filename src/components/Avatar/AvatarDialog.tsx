import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

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
                <p>You can upload an image in JPG or PNG format.</p>
                {image ? (
                    <img src={window.URL.createObjectURL(image)} />
                ) : (
                    <Button>
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

export default AvatarDialog;
