import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table';
import type { LectureRow } from '../helpers';
import { LectureActions } from './LectureActions';

interface LecturesTableProps {
    rows: LectureRow[];
    canManage: (author?: string) => boolean;
    onRemoved: () => void;
}

// Rows in, actions out: the table knows nothing about loading, paging, or the
// store, so it can be rendered straight from a fixture.
export const LecturesTable = ({
    rows,
    canManage,
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
                            onRemoved={onRemoved}
                        />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
