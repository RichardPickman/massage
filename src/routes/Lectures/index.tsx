import { RequireAuth } from '../../components/RequireAuth';
import { AddLecture } from '../../pages/AddLecture';
import { EditLecture } from '../../pages/EditLecture';
import { Lecture, loader as lectureLoader } from '../../pages/Lecture';
import { Lectures, loader as lecturesLoader } from '../../pages/Lectures';

export const lectureRouter = [
    {
        path: 'lectures',
        children: [
            {
                index: true,
                element: <Lectures />,
                loader: lecturesLoader,
            },
            {
                path: 'create',
                element: (
                    <RequireAuth>
                        <AddLecture />
                    </RequireAuth>
                ),
            },
        ],
    },
    {
        path: 'lectures/:id/edit',
        element: (
            <RequireAuth>
                <EditLecture />
            </RequireAuth>
        ),
        loader: lectureLoader,
    },
    {
        path: 'lectures/:id',
        element: <Lecture />,
        loader: lectureLoader,
    },
];
