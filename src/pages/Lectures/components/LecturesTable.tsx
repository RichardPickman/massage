import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table';
import type { LectureListState } from '../../../utils/lectureList';
import type { LectureRow } from '../helpers';
import { LectureActions } from './LectureActions';

interface LecturesTableProps {
    rows: LectureRow[];
    canManage: (author?: string) => boolean;
    listState: LectureListState;
    onRemoved: () => void;
}

// Rows in, actions out: the table knows nothing about loading, paging, or the
// store, so it can be rendered straight from a fixture.
export const LecturesTable = ({
    rows,
    canManage,
    listState,
    onRemoved,
}: LecturesTableProps) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Lesson</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {rows.map((lecture) => (
                <TableRow key={lecture.id}>
                    <TableCell>
                        <Link
                            className="underline underline-offset-4"
                            to={`/lectures/${lecture.id}`}
                            state={listState}
                        >
                            {lecture.topic}
                        </Link>
                    </TableCell>
                    <TableCell>{lecture.lesson}</TableCell>
                    <TableCell>{lecture.teacher}</TableCell>
                    <TableCell>{lecture.date}</TableCell>
                    <TableCell>
                        <LectureActions
                            id={lecture.id}
                            topic={lecture.topic}
                            canManage={canManage(lecture.author)}
                            listState={listState}
                            onRemoved={onRemoved}
                        />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
