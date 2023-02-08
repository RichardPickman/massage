import { Box, Button, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useLoaderData } from 'react-router-dom';
import React from 'react';
import MassageService from '../../services/Massage';
import { useSelector } from 'react-redux';

function Massages() {
    const { isAuth } = useSelector((state) => state.auth);
    const loaderData = useLoaderData();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
        >
            <Box display="flex" justifyContent="space-between" width="40%">
                <Typography variant="h4">Massages</Typography>
                {isAuth && (
                    <Link underline="none" to={'create'} component={RouterLink}>
                        <Button variant="outlined">Add massage</Button>
                    </Link>
                )}
            </Box>
            {loaderData.length === 0 && (
                <Typography variant="body1">
                    There is no any massages yet...
                </Typography>
            )}
            <Stack>
                {loaderData.map((massage, index) => (
                    <Link
                        underline="none"
                        key={index}
                        to={`/massages/${massage._id}`}
                        component={RouterLink}
                    >
                        <Button>{massage.title}</Button>
                    </Link>
                ))}
            </Stack>
        </Box>
    );
}

export const loader = async () => {
    const { payload } = await MassageService.getAllMassages();

    return payload;
};

export default Massages;
