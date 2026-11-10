import { Link, useLoaderData, useRevalidator } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
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
import { LectureActions } from './components/LectureActions';
import { getTableRows, type LectureRow } from './helpers';

export const Lectures = () => {
    const lectures = useLoaderData() as LectureRow[];
    const { isAuth, user } = useAppSelector((state) => state.auth);
    const revalidator = useRevalidator();

    const canManage = (author?: string) =>
        isAuth && (user?.role === 'admin' || String(author ?? '') === user?.id);

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <CardTitle>Lectures</CardTitle>
                    <CardDescription>
                        Image slides, grouped by session.
                    </CardDescription>
                </div>
                {isAuth ? (
                    <Button asChild size="sm">
                        <Link to="create">Add lecture</Link>
                    </Button>
                ) : null}
            </CardHeader>
            <CardContent>
                {lectures.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
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
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
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
                                    <TableCell>
                                        <LectureActions
                                            id={lecture.id}
                                            topic={lecture.topic}
                                            canManage={canManage(
                                                lecture.author
                                            )}
                                            onRemoved={() =>
                                                revalidator.revalidate()
                                            }
                                        />
                                    </TableCell>
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
