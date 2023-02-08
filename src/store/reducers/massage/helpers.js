import { nanoid } from '@reduxjs/toolkit';
import itemTypes from '../../../utils/itemTypes';

export const parseTechnics = (technics) =>
    technics.map((technic) => {
        const grips = technic.grips.map((grip) => grip._id);

        return {
            title: technic.title,
            grips: grips,
        };
    });

export const getTechnic = (title) => ({
    acceptsSelf: [itemTypes.BOX],
    acceptsChildren: [itemTypes.GRIP],
    id: nanoid(),
    title,
    grips: [],
});

export const getTemplate = () => [
    getTechnic('Głaskania'),
    getTechnic('Rozcierania'),
    getTechnic('Ugniatanie'),
    getTechnic('Uciski'),
    getTechnic('Oklepywanie'),
    getTechnic('Wibracja'),
    getTechnic('Rostrząsanie'),
    getTechnic('Głaskania'),
];
