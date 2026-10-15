import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FloppyDiskIcon, TrashIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { AlertWithLink } from '../../components/AlertWithLink';
import { Button } from '../../components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import QuestionService from '../../services/Question';
import QuizService from '../../services/Quiz';
import RandomData from '../../services/RandomData';
import { getErrorMessage } from '../../services/errors';
import { alertStatuses, type AlertStatus } from '../../utils/consts';
import { QuestionTemplate } from './template';
import {
    getObjectWithId,
    prepareQuestion,
    questionTemp,
    type ConstructorQuestion,
} from './helpers';

interface ConstructorAlert {
    status: AlertStatus;
    text: string;
    path?: string;
}

const getBlankQuestion = (): ConstructorQuestion =>
    getObjectWithId({
        ...questionTemp,
        answers: questionTemp.answers.map((answer) =>
            getObjectWithId({ text: answer.text })
        ),
    });

export const QuizConstructor = () => {
    const [questions, setQuestions] = useState<ConstructorQuestion[]>([]);
    const [title, setTitle] = useState('');
    const [alert, setAlert] = useState<ConstructorAlert | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [listRef] = useAutoAnimate();

    const updateQuestion = (id: string, data: Partial<ConstructorQuestion>) =>
        setQuestions((prevQuestions) =>
            prevQuestions.map((item) =>
                item.id === id ? { ...item, ...data } : item
            )
        );

    const removeQuestion = (id: string) =>
        setQuestions((prevQuestions) =>
            prevQuestions.filter((item) => item.id !== id)
        );

    const setQuestionsCount = (amount: string) => {
        const parsed = Number(amount);
        const count = Number.isFinite(parsed)
            ? Math.min(Math.max(Math.trunc(parsed), 0), 100)
            : 0;

        setQuestions(Array.from({ length: count }, () => getBlankQuestion()));
    };

    const saveQuiz = async () => {
        if (!title.trim()) {
            setAlert({
                status: alertStatuses.FAIL,
                text: 'Quiz title cannot be empty',
            });

            return;
        }

        // A question without answers makes the API throw, and a single answer
        // arrives as a bare string there and crashes it, so both are caught
        // before anything is sent.
        const filledQuestions = questions.filter(
            (question) =>
                question.question.trim() &&
                question.answers.some((answer) => answer.text.trim())
        );

        if (filledQuestions.length === 0) {
            setAlert({
                status: alertStatuses.FAIL,
                text: 'Add at least one question with a filled answer',
            });

            return;
        }

        const singleAnswerQuestion = filledQuestions.some(
            (question) =>
                question.answers.filter((answer) => answer.text.trim())
                    .length < 2
        );

        if (singleAnswerQuestion) {
            setAlert({
                status: alertStatuses.FAIL,
                text: 'Every question needs at least two answers',
            });

            return;
        }

        setIsSaving(true);

        try {
            const savedQuestions = await Promise.all(
                filledQuestions.map((question) =>
                    QuestionService.createQuestion(prepareQuestion(question))
                )
            );

            const questionIds = savedQuestions.map(
                (question) => question.payload._id
            );

            const imageResponse = await RandomData.getImage(250, 150).catch(
                () => null
            );

            const response = await QuizService.createQuiz({
                questions: questionIds,
                title: title.trim(),
                image: imageResponse ? imageResponse.url : '',
            });

            setAlert({
                status: alertStatuses.SUCCESS,
                text: response.message,
                path: `/quiz/${response.payload._id}`,
            });
        } catch (error) {
            setAlert({
                status: alertStatuses.FAIL,
                text: getErrorMessage(error),
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quiz constructor</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {alert ? (
                    <AlertWithLink
                        status={alert.status}
                        text={alert.text}
                        path={alert.path}
                        title="Open quiz"
                        onClose={() => setAlert(null)}
                    />
                ) : null}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="quiz-title">Quiz title</Label>
                    <Input
                        id="quiz-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="quiz-questions">Questions amount</Label>
                    <Input
                        id="quiz-questions"
                        type="number"
                        min={0}
                        max={100}
                        onChange={(event) =>
                            setQuestionsCount(event.target.value)
                        }
                    />
                </div>
                <div ref={listRef} className="flex flex-col gap-4">
                    {questions.map((question) => (
                        <QuestionTemplate
                            key={question.id}
                            questionData={question}
                            updateQuestion={updateQuestion}
                            removeQuestion={removeQuestion}
                        />
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button disabled={isSaving} onClick={saveQuiz}>
                        <FloppyDiskIcon />
                        {isSaving ? 'Saving...' : 'Save quiz'}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setQuestions([])}
                    >
                        <TrashIcon />
                        Clear questions
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
