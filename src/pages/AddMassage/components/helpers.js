import { nanoid } from '@reduxjs/toolkit';
import itemTypes from '../../../utils/itemTypes';

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

export const parseTechnics = (technics) =>
    technics.map((technic) => {
        const grips = technic.grips.map((grip) => grip._id);

        return {
            title: technic.title,
            grips: grips,
        };
    });
