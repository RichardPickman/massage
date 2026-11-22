import { useTranslation } from 'react-i18next';
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

// Same shape as the stats page: below md the table becomes a list of cards, so
// the four facts about a lecture are readable without swiping. The table is not
// shrunk and its columns are not hidden - either of those would leave the page
// showing a title and nothing else on a phone.
export const LecturesTable = ({
    rows,
    canManage,
    listState,
    onRemoved,
}: LecturesTableProps) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="flex flex-col gap-3 md:hidden">
                {rows.map((lecture) => (
                    <div
                        key={lecture.id}
                        className="flex flex-col gap-2 rounded-lg border p-3 md:p-4"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <Link
                                to={`/lectures/${lecture.id}`}
                                state={listState}
                                className="min-w-0 font-medium underline-offset-4 hover:underline"
                            >
                                {lecture.topic}
                            </Link>
                            <LectureActions
                                id={lecture.id}
                                topic={lecture.topic}
                                canManage={canManage(lecture.author)}
                                listState={listState}
                                onRemoved={onRemoved}
                            />
                        </div>
                        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                            <div className="flex min-w-0 flex-col">
                                <dt className="text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase">
                                    {t('lectures.columns.lesson')}
                                </dt>
                                <dd className="truncate">{lecture.lesson}</dd>
                            </div>
                            <div className="flex min-w-0 flex-col">
                                <dt className="text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase">
                                    {t('lectures.columns.teacher')}
                                </dt>
                                <dd className="truncate">{lecture.teacher}</dd>
                            </div>
                            <div className="flex min-w-0 flex-col">
                                <dt className="text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase">
                                    {t('lectures.columns.date')}
                                </dt>
                                <dd className="tabular-nums">{lecture.date}</dd>
                            </div>
                        </dl>
                    </div>
                ))}
            </div>
            <div className="hidden overflow-hidden rounded-lg border md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('lectures.columns.topic')}</TableHead>
                            <TableHead>
                                {t('lectures.columns.lesson')}
                            </TableHead>
                            <TableHead>
                                {t('lectures.columns.teacher')}
                            </TableHead>
                            <TableHead>{t('lectures.columns.date')}</TableHead>
                            <TableHead className="text-right">
                                {t('lectures.columns.actions')}
                            </TableHead>
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
            </div>
        </>
    );
};
