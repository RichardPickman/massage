import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Link, Typography } from '@mui/material';
import Theme from '../Theme';
import React from 'react';
import { paths, auth } from './paths';
import { useSelector } from 'react-redux';
import AccountMenu from '../AccountMenu';

const Header = () => {
    const { isAuth } = useSelector((state) => state.auth);

    return (
        <Box component="header" margin={2}>
            <Grid container>
                <Grid item xs={3}>
                    <Typography variant="h5">RP</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Box
                        component="ul"
                        display="flex"
                        justifyContent="center"
                        height="100%"
                        alignItems="center"
                        gap={4}
                    >
                        {paths.map((elem, index) => {
                            if (!elem.authRequired) {
                                return (
                                    <Box component="li" key={index}>
                                        <Link
                                            underline="none"
                                            to={elem.path}
                                            component={RouterLink}
                                        >
                                            {elem.name}
                                        </Link>
                                    </Box>
                                );
                            }

                            if (elem.authRequired) {
                                return isAuth ? (
                                    <Box component="li" key={index}>
                                        <Link
                                            underline="none"
                                            to={elem.path}
                                            component={RouterLink}
                                        >
                                            {elem.name}
                                        </Link>
                                    </Box>
                                ) : null;
                            }
                        })}
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <Box
                        component="ul"
                        display="flex"
                        justifyContent="right"
                        alignItems="center"
                        gap={4}
                    >
                        {isAuth ? (
                            <AccountMenu />
                        ) : (
                            auth.map((link, index) => (
                                <Box component="li" key={index}>
                                    <Link
                                        underline="none"
                                        to={link.path}
                                        component={RouterLink}
                                    >
                                        {link.name}
                                    </Link>
                                </Box>
                            ))
                        )}
                        <Theme />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Header;
