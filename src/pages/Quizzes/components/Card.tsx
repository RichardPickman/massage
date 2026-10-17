import { TrashIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card';
import type { QuizSummary } from '../../../services/models';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchRemove } from '../../../store/reducers/quizzes/fetch';

interface QuizCardProps {
    quiz: QuizSummary;
}

export const QuizCard = ({ quiz }: QuizCardProps) => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const [isRemoving, setIsRemoving] = useState(false);

    const questionCount = quiz.questions ? quiz.questions.length : 0;

    const handleDelete = async () => {
        setIsRemoving(true);
        await dispatch(fetchRemove(quiz._id));
        setIsRemoving(false);
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
            <CardFooter className="justify-end">
                {user ? (
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={isRemoving}
                        aria-label={`Remove ${quiz.title}`}
                        onClick={handleDelete}
                    >
                        <TrashIcon />
                    </Button>
                ) : null}
            </CardFooter>
        </Card>
    );
};

