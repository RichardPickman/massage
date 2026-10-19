import { CircleNotchIcon, TrashIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card';
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
    const { isAuth } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const [isConfirming, setIsConfirming] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [removeError, setRemoveError] = useState<string | null>(null);

    const questionCount = quiz.questions ? quiz.questions.length : 0;

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
            setRemoveError(result.payload ?? 'Failed to remove quiz');
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-base normal-case">
                    <Link
                        className="underline underline-offset-4"
                        to={`/quiz/${quiz._id}`}
                    >
                        {quiz.title}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
                {questionCount} {questionCount === 1 ? 'question' : 'questions'}
            </CardContent>
            {removeError ? (
                <CardContent>
                    <Alert variant="destructive">
                        <div className="flex flex-col gap-1">
                            <AlertTitle>Quiz was not removed</AlertTitle>
                            <AlertDescription className="text-destructive">
                                {removeError}
                            </AlertDescription>
                        </div>
                    </Alert>
                </CardContent>
            ) : null}
            <CardFooter className="justify-end">
                {isAuth ? (
                    <Dialog
                        open={isConfirming}
                        onOpenChange={handleConfirmOpenChange}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                disabled={isRemoving}
                                aria-label={`Remove ${quiz.title}`}
                            >
                                <TrashIcon />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Remove quiz?</DialogTitle>
                                <DialogDescription>
                                    {quiz.title} will be deleted permanently.
                                    This action cannot be undone.
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
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    disabled={isRemoving}
                                    onClick={handleDelete}
                                >
                                    {isRemoving ? (
                                        <>
                                            <CircleNotchIcon className="animate-spin" />
                                            Removing...
                                        </>
                                    ) : (
                                        'Remove'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ) : null}
            </CardFooter>
        </Card>
    );
};
