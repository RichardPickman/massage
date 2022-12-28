import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Accordion from '../../components/Accordion';
import MassageService from '../../services/Massage';

export default function Massage() {
    const loaderData = useLoaderData();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
        >
            <Typography variant={'h3'}>{loaderData.title}</Typography>
            <Box width="50%">
                {loaderData.technics.map((item) => (
                    <Accordion
                        key={item._id}
                        technic={item}
                        isConstructor={false}
                    />
                ))}
            </Box>
        </Box>
    );
}

export const loader = async ({ params }) => {
    const { id } = params;
    const request = await MassageService.getMassage(id);

    return request.payload;
};
