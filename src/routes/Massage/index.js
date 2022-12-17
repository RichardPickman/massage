import React from 'react';
import Massages, { loader as loaderAllMassages } from '../../pages/Massages';
import MassageLayout from '../../layouts/Massage';
import Error from '../../pages/Error';
import Massage, { loader as massageLoader } from '../../pages/Massage';
import AddMassage, { loader as massageAddLoader } from '../../pages/AddMassage';

export const massageRouter = {
    path: '/massages',
    element: <MassageLayout />,
    errorElement: <Error />,
    children: [
        {
            index: true,
            element: <Massages />,
            loader: loaderAllMassages,
        },
        {
            path: ':id',
            element: <Massage />,
            loader: massageLoader,
        },
        {
            path: 'create',
            element: <AddMassage />,
            loader: massageAddLoader,
        },
    ],
};
