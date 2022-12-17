import { Box, Button, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLoaderData } from 'react-router-dom';
import React from 'react';
import Header from '../../components/Header';
import MassageService from '../../services/Massage';

function Massages() {
    const loaderData = useLoaderData();

    return (
        <>
            <Header />
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap={1}
                margin={2}
            >
                <Button variant="outlined">
                    <Link underline="none" to={'create'} component={RouterLink}>
                        Add massage
                    </Link>
                </Button>
                <Typography variant="h3">Massages</Typography>
                {loaderData.length === 0 && (
                    <Typography variant="body1">
                        There is no any massages yet...
                    </Typography>
                )}
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
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
                </Box>
            </Box>
        </>
    );
}

export const loader = async () => {
    const { payload } = await MassageService.getAllMassages();

    return payload;
};

export default Massages;
