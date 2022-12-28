import React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ExpandMoreOutlined } from '@mui/icons-material';

export const StyledAccordion = styled((props) => (
    <MuiAccordion
        disableGutters
        elevation={0}
        square
        {...props}
        sx={{ width: '100%' }}
    />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    width: '100%',
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

export const StyledAccordionSummary = styled((props) => (
    <MuiAccordionSummary expandIcon={<ExpandMoreOutlined />} {...props} />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    width: '100%',
    '& .MuiAccordionSummary-expandIconWrapper': {
        transform: 'rotate(0deg)',
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(180deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

export const StyledAccordionDetails = styled(MuiAccordionDetails)(
    ({ theme }) => ({
        padding: theme.spacing(2),
        width: '100%',
        borderTop: '1px solid rgba(0, 0, 0, .125)',
    })
);
