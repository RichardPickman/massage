import { CircleNotchIcon, TrashIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../../components/ui/dialog';
import type { QuizSummary } from '../../../services/models';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchRemove } from '../../../store/reducers/quizzes/fetch';

interface QuizCardProps {
    quiz: QuizSummary;
}

export const QuizCard = ({ quiz }: QuizCardProps) => {
    const { t } = useTranslation();
    const { isAuth, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const [isConfirming, setIsConfirming] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [removeError, setRemoveError] = useState<string | null>(null);

    const questionCount = quiz.questions ? quiz.questions.length : 0;

    // The server only lets the author (or an admin) delete, so the control is
    // hidden for everyone else instead of offering an action that ends in 403.
    const canRemove =
        isAuth &&
        (user?.role === 'admin' || String(quiz.author ?? '') === user?.id);

    // The request cannot be cancelled, so the dialog stays put until it settles.
    const handleConfirmOpenChange = (open: boolean) => {
        if (!isRemoving) {
            setIsConfirming(open);
        }
    };

    const handleDelete = async () => {
        setIsRemoving(true);
        setRemoveError(null);

        const result = await dispatch(fetchRemove(quiz._id));

        setIsRemoving(false);
        setIsConfirming(false);

        if (fetchRemove.rejected.match(result)) {
            setRemoveError(result.payload ?? t('quizzes.failedToRemove'));
        }
    };

    return (
        <Card className="w-full transition-colors hover:ring-foreground/10">
            {/* One body, not three stacked strips: title, one meta line and the
                action sit in a single row group, so the card reads as one item
                rather than as a header band plus a footer band. */}
            <div className="flex items-start justify-between gap-3 px-(--card-spacing)">
                <div className="flex min-w-0 flex-col gap-1">
                    <Link
                        className="truncate font-medium underline-offset-4 hover:underline"
                        to={`/quiz/${quiz._id}`}
                    >
                        {quiz.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        {t('quizzes.questions', { count: questionCount })}
                    </p>
                </div>
                {canRemove ? (
                    <Dialog
                        open={isConfirming}
                        onOpenChange={handleConfirmOpenChange}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="size-11 shrink-0 md:size-8"
                                disabled={isRemoving}
                                aria-label={t('quizzes.remove', {
                                    title: quiz.title,
                                })}
                            >
                                <TrashIcon />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {t('quizzes.removeTitle')}
                                </DialogTitle>
                                <DialogDescription>
                                    {t('quizzes.removeBody', {
                                        title: quiz.title,
                                    })}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    disabled={isRemoving}
                                    onClick={() =>
                                        handleConfirmOpenChange(false)
                                    }
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    variant="destructive"
                                    disabled={isRemoving}
                                    onClick={handleDelete}
                                >
                                    {isRemoving ? (
                                        <>
                                            <CircleNotchIcon className="animate-spin" />
                                            {t('common.removing')}
                                        </>
                                    ) : (
                                        t('common.remove')
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ) : null}
            </div>
            {removeError ? (
                <div className="px-(--card-spacing)">
                    <Alert variant="destructive">
                        <AlertTitle>{t('quizzes.removeFailed')}</AlertTitle>
                        <AlertDescription className="text-destructive">
                            {removeError}
                        </AlertDescription>
                    </Alert>
                </div>
            ) : null}
        </Card>
    );
};
