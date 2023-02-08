import React from 'react';

import { Box, IconButton, Stack, Link, Typography } from '@mui/material';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { memo } from 'react';
import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ThemeContext } from '../../../components/ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';
import { finish } from '../../../store/reducers/images';

const ImageHeader = () => {
    const images = useSelector((state) => state.images);
    const dispatch = useDispatch();

    const theme = useContext(ThemeContext);

    const handleClose = () => dispatch(finish());

    return (
        images.showMenus && (
            <Box
                display="flex"
                width="100%"
                sx={{
                    width: '100%',
                    position: 'absolute',
                    backgroundColor: theme.darkEnabled
                        ? 'rgba(0, 0, 0, 0.4)'
                        : 'rgba(255, 255, 255, 0.4)',
                    zIndex: 2,
                }}
                flexDirection="column"
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box display="flex" gap={1}>
                        <Typography variant="body1">
                            {images.currentIndex + 1}
                        </Typography>
                        <Typography variant="body1">/</Typography>
                        <Typography variant="body1">
                            {images.slides.length}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <IconButton>
                            <OpenInNewOutlinedIcon />
                        </IconButton>
                        <IconButton>
                            {images.showMenus ? (
                                <ZoomOutOutlinedIcon />
                            ) : (
                                <ZoomInOutlinedIcon />
                            )}
                        </IconButton>
                        <Link to="/lectures" component={RouterLink}>
                            <IconButton onClick={handleClose}>
                                <CloseOutlinedIcon />
                            </IconButton>
                        </Link>
                    </Stack>
                </Box>
            </Box>
        )
    );
};

export default memo(ImageHeader);
