import { ArrowUpRightIcon } from '@phosphor-icons/react';
import { cn } from 'cn';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { OverallStats } from '../../../services/types';
import {
    formatPercent,
    getScoreTone,
    removedQuizTitle,
    scoreToneClasses,
} from '../helpers';
import { Sparkline } from './Sparkline';

interface QuizStatsTableProps {
    quizzes: OverallStats['quizzes'];
}

export const QuizStatsTable = ({ quizzes }: QuizStatsTableProps) => {
    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>By test</CardTitle>
                <CardDescription>
                    Best, average and latest score per test. Most recent
                    activity first.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Below md the table is replaced, not shrunk: three numeric
                    columns in 288px are unreadable, and hiding columns silently
                    loses the data the page exists to show. */}
                <div className="flex flex-col gap-3 md:hidden">
                    {quizzes.map((quiz) => {
                        const isRemoved = quiz.title === removedQuizTitle;
                        const body = (
                            <div className="flex flex-col gap-3 rounded-lg border p-3 md:p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <span className="min-w-0 truncate font-medium">
                                        {quiz.title}
                                    </span>
                                    {isRemoved ? (
                                        <Badge variant="outline">Removed</Badge>
                                    ) : null}
                                </div>
                                <dl className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="flex flex-col">
                                        <dt className="text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase">
                                            Best
                                        </dt>
                                        <dd
                                            className={cn(
                                                'font-medium tabular-nums',
                                                scoreToneClasses[
                                                    getScoreTone(quiz.best)
                                                ]
                                            )}
                                        >
                                            {formatPercent(quiz.best)}
                                        </dd>
                                    </div>
                                    <div className="flex flex-col">
                                        <dt className="text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase">
                                            Average
                                        </dt>
                                        <dd className="tabular-nums">
                                            {formatPercent(quiz.average)}
                                        </dd>
                                    </div>
                                    <div className="flex flex-col">
                                        <dt className="text-[0.6875rem] tracking-[0.08em] text-muted-foreground uppercase">
                                            Last
                                        </dt>
                                        <dd
                                            className={cn(
                                                'tabular-nums',
                                                scoreToneClasses[
                                                    getScoreTone(quiz.last)
                                                ]
                                            )}
                                        >
                                            {formatPercent(quiz.last)}
                                        </dd>
                                    </div>
                                </dl>
                                <div className="flex items-center justify-between gap-2">
                                    <Sparkline
                                        history={quiz.history}
                                        label={`${quiz.title} score trend`}
                                    />
                                    <span className="text-xs text-muted-foreground tabular-nums">
                                        {quiz.count}{' '}
                                        {quiz.count === 1
                                            ? 'attempt'
                                            : 'attempts'}
                                    </span>
                                </div>
                            </div>
                        );

                        return isRemoved ? (
                            <div key={quiz.quizId}>{body}</div>
                        ) : (
                            <Link
                                key={quiz.quizId}
                                to={`/quiz/${quiz.quizId}`}
                                className="block rounded-lg transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                aria-label={`Open ${quiz.title}`}
                            >
                                {body}
                            </Link>
                        );
                    })}
                </div>
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Test</TableHead>
                                <TableHead className="text-right">
                                    Attempts
                                </TableHead>
                                <TableHead className="text-right">
                                    Best
                                </TableHead>
                                <TableHead className="hidden text-right sm:table-cell">
                                    Average
                                </TableHead>
                                <TableHead className="hidden text-right md:table-cell">
                                    Last
                                </TableHead>
                                <TableHead className="hidden lg:table-cell">
                                    Trend
                                </TableHead>
                                <TableHead className="w-10" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quizzes.map((quiz) => {
                                const isRemoved =
                                    quiz.title === removedQuizTitle;

                                return (
                                    <TableRow key={quiz.quizId}>
                                        <TableCell className="max-w-56">
                                            <div className="flex items-center gap-2">
                                                {isRemoved ? (
                                                    <span className="truncate text-muted-foreground">
                                                        {quiz.title}
                                                    </span>
                                                ) : (
                                                    <Link
                                                        to={`/quiz/${quiz.quizId}`}
                                                        className="truncate font-medium underline-offset-4 hover:underline"
                                                    >
                                                        {quiz.title}
                                                    </Link>
                                                )}
                                                {isRemoved ? (
                                                    <Badge variant="outline">
                                                        Removed
                                                    </Badge>
                                                ) : null}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {quiz.count}
                                        </TableCell>
                                        <TableCell
                                            className={cn(
                                                'text-right font-medium tabular-nums',
                                                scoreToneClasses[
                                                    getScoreTone(quiz.best)
                                                ]
                                            )}
                                        >
                                            {formatPercent(quiz.best)}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="flex items-center justify-end gap-3">
                                                <Progress
                                                    value={quiz.average}
                                                    className="h-1 w-16"
                                                />
                                                <span className="w-9 text-right tabular-nums">
                                                    {formatPercent(
                                                        quiz.average
                                                    )}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            className={cn(
                                                'hidden text-right tabular-nums md:table-cell',
                                                scoreToneClasses[
                                                    getScoreTone(quiz.last)
                                                ]
                                            )}
                                        >
                                            {formatPercent(quiz.last)}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <Sparkline
                                                history={quiz.history}
                                                label={`${quiz.title} score trend`}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {isRemoved ? null : (
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    aria-label={`Open ${quiz.title}`}
                                                >
                                                    <Link
                                                        to={`/quiz/${quiz.quizId}`}
                                                    >
                                                        <ArrowUpRightIcon />
                                                    </Link>
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};
