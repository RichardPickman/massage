import { Link, useLoaderData } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../components/ui/table';
import LectureService from '../../services/Lecture';
import { useAppSelector } from '../../store';
import { getTableRows, type LectureRow } from './helpers';

export const Lectures = () => {
    const lectures = useLoaderData() as LectureRow[];
    const { isAuth } = useAppSelector((state) => state.auth);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lectures</CardTitle>
                {isAuth ? (
                    <Button asChild size="sm">
                        <Link to="create">Add lecture</Link>
                    </Button>
                ) : null}
            </CardHeader>
            <CardContent>
                {lectures.length === 0 ? (
                    <p className="text-muted-foreground">
                        There are no lectures yet.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Topic</TableHead>
                                <TableHead>Lesson</TableHead>
                                <TableHead>Teacher</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lectures.map((lecture) => (
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export const loader = async () => {
    const { payload } = await LectureService.getAllLectures();

    return getTableRows(payload);
};
