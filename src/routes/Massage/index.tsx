import MassageLayout from '../../layouts/Massage';
import AddMassage, { loader as massageAddLoader } from '../../pages/AddMassage';
import { ErrorPage } from '../../pages/Error';
import Massage, { loader as massageLoader } from '../../pages/Massage';
import Massages, { loader as loaderAllMassages } from '../../pages/Massages';

export const massageRouter = {
    path: '/massages',
    element: <MassageLayout />,
    errorElement: <ErrorPage />,
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
