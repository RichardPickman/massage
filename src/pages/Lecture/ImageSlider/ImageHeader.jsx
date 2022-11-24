import React from 'react';

import { Box, IconButton, Stack, Link, Typography } from '@mui/material';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { memo } from 'react';
import { useContext } from 'react';
import { ImagesContext } from '../../../context/images';
import { Link as RouterLink } from 'react-router-dom';
import { LayoutContext } from '../../../context/layout';
import { ThemeContext } from '../../../components/ThemeProvider';

const ImageHeader = () => {
    const [imagesState, dispatch] = useContext(ImagesContext);
    const [layoutState, dispatchLayoutState] = useContext(LayoutContext);

    const theme = useContext(ThemeContext);

    const handleClose = () => {
        dispatchLayoutState({ type: 'SHOW' });
        dispatch({ type: 'finish' });
    };

    return (
        imagesState.showMenus && (
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
                    margin={2}
                >
                    <Box display="flex" gap={1}>
                        <Typography variant="body1">
                            {imagesState.currentIndex + 1}
                        </Typography>
                        <Typography variant="body1">/</Typography>
                        <Typography variant="body1">
                            {imagesState.slides.length}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <IconButton>
                            <OpenInNewOutlinedIcon />
                        </IconButton>
                        <IconButton>
                            {imagesState.showMenus ? (
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
