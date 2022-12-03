import { Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import Theme from '../Theme';
import React from 'react';
import { paths } from './paths';

const Header = () => {
    return (
        <Box component="header">
            <Box
                component="ul"
                display="flex"
                alignSelf="center"
                justifySelf="center"
                justifyContent="center"
                alignItems="center"
                gap={4}
            >
                {paths.map((link, index) => (
                    <Box component="li" key={index}>
                        <Link
                            underline="none"
                            to={link.path}
                            component={RouterLink}
                        >
                            {link.name}
                        </Link>
                    </Box>
                ))}
                <Box component="li">
                    <Theme />
                </Box>
            </Box>
        </Box>
    );
};

export default Header;
