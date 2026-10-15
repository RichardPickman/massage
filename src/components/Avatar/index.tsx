import React, { useState } from 'react';
import { Card } from '../ui/card';
import AvatarDialog from './AvatarDialog';

const noImage =
    'https://png.pngtree.com/png-vector/20190820/ourlarge/pngtree-no-avatar-vector-isolated-on-white-background-png-image_1694546.jpg';

function Avatar({ width, height, onAvatarChange, predefinedAvatar }) {
    const [predefinedImage, setPredefinedImage] = useState(
        predefinedAvatar || noImage
    );
    const [image, setImage] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const handleUploadOpen = () => setIsUploadOpen(true);
    const handleUploadClose = () => setIsUploadOpen(false);

    const onSave = (img) => {
        setPredefinedImage(noImage);
        setImage(img);
        setIsUploadOpen(false);
        setAnchorEl(false);
        onAvatarChange(img);
    };

    const menuOpen = Boolean(anchorEl);
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const removeAvatar = () => {
        setImage(null);
        setPredefinedImage(noImage);
        onAvatarChange(null);
        setAnchorEl(null);
    };

    return (
        <Card>
            <Card
                id="basic-button"
                aria-controls={menuOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? 'true' : undefined}
                sx={{
                    objectFit: 'cover',
                    borderRadius: '50%',
                    width: width,
                    height: height,
                }}
                component="img"
                onClick={handleMenuOpen}
                src={
                    image ? window.URL.createObjectURL(image) : predefinedImage
                }
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleUploadOpen}>
                    <ListItemIcon>
                        <EditOutlinedIcon
                            sx={{ color: '#71aaeb' }}
                            fontSize="small"
                        />
                    </ListItemIcon>
                    <ListItemText>Change photo</ListItemText>
                </MenuItem>
                <MenuItem onClick={removeAvatar}>
                    <ListItemIcon>
                        <DeleteOutlineOutlinedIcon
                            color="error"
                            fontSize="small"
                        />
                    </ListItemIcon>
                    <ListItemText>Delete photo</ListItemText>
                </MenuItem>
            </Menu>
            <AvatarDialog
                onClose={handleUploadClose}
                open={isUploadOpen}
                onChange={onSave}
            />
        </Card>
    );
}

export default Avatar;
