import styled from '@emotion/styled';
import { Paper } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import itemTypes from '../../../utils/itemTypes';

export const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 0.5rem 0 1rem',
    alignItems: 'center',
    border: '1px dotted',
    color: theme.palette.text.secondary,
    height: 40,
    lineHeight: '40px',
}));

export const getTechnic = (title) => ({
    acceptsSelf: [itemTypes.BOX],
    acceptsChildren: [itemTypes.GRIP],
    id: nanoid(),
    title,
    grips: [],
});

export const getDraggableGrip = (obj) => ({
    type: itemTypes.GRIP,
    ...obj,
});

export const template = [
    getTechnic('Głaskania'),
    getTechnic('Rozcierania'),
    getTechnic('Ugniatanie'),
    getTechnic('Uciski'),
    getTechnic('Oklepywanie'),
    getTechnic('Wibracja'),
    getTechnic('Rostrząsanie'),
    getTechnic('Głaskania'),
];
