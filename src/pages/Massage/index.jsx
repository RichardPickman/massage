import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Accordion from '../../components/Accordion';
import {
    StyledAccordionDetails,
    StyledAccordionSummary,
} from '../../components/Accordion/styles';
import MassageService from '../../services/Massage';
import { ExpandMoreOutlined } from '@mui/icons-material';

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
                {loaderData.technics.map((technic) => (
                    <Accordion key={technic._id}>
                        <StyledAccordionSummary
                            expandIcon={
                                technic.grips.length > 0 ? (
                                    <ExpandMoreOutlined />
                                ) : (
                                    false
                                )
                            }
                        >
                            <Typography textTransform={'capitalize'}>
                                {technic.title}
                            </Typography>
                        </StyledAccordionSummary>
                        {technic.grips.length > 0 && (
                            <StyledAccordionDetails>
                                {technic.grips.map((grip) => (
                                    <Typography key={grip._id}>
                                        {technic.title}
                                    </Typography>
                                ))}
                            </StyledAccordionDetails>
                        )}
                    </Accordion>
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
