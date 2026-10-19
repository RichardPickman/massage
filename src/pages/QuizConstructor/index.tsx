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
    const [questionCount, setQuestionCount] = useState(0);
    const [countInput, setCountInput] = useState('');
    const [title, setTitle] = useState('');
    const [alert, setAlert] = useState<ConstructorAlert | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [listRef] = useAutoAnimate();

    // Lowering the count only hides rows; the authored data stays in state so
    // a mistyped number cannot destroy answers, and raising the count brings
    // the hidden rows back.
    const visibleQuestions = questions.slice(0, questionCount);

    const updateQuestion = (id: string, data: Partial<ConstructorQuestion>) =>
        setQuestions((prevQuestions) =>
            prevQuestions.map((item) =>
                item.id === id ? { ...item, ...data } : item
            )
        );

    const removeQuestion = (id: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.filter((item) => item.id !== id)
        );

        const nextCount = Math.max(questionCount - 1, 0);

        setQuestionCount(nextCount);
        setCountInput(nextCount === 0 ? '' : String(nextCount));
    };

    const setQuestionsCount = (amount: string) => {
        const parsed = Number(amount);
        const count = Number.isFinite(parsed)
            ? Math.min(Math.max(Math.trunc(parsed), 0), 100)
            : 0;

        setCountInput(amount);
        setQuestions((prevQuestions) => {
            if (count <= prevQuestions.length) {
                return prevQuestions;
            }

            return [
                ...prevQuestions,
                ...Array.from({ length: count - prevQuestions.length }, () =>
                    getBlankQuestion()
                ),
            ];
        });
        setQuestionCount(count);
    };

    const clearQuestions = () => {
        setQuestions([]);
        setQuestionCount(0);
        setCountInput('');
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
        const filledQuestions = visibleQuestions.filter(
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
                question.answers.filter((answer) => answer.text.trim()).length <
                2
        );

        if (singleAnswerQuestion) {
            setAlert({
                status: alertStatuses.FAIL,
                text: 'Every question needs at least two answers',
            });

            return;
        }

        setIsSaving(true);

        const savedQuestionIds: string[] = [];

        try {
            // Questions are created one at a time so a failure leaves a known
            // set to roll back, rather than the orphans a rejected
            // Promise.all would leave behind.
            for (const question of filledQuestions) {
                const savedQuestion = await QuestionService.createQuestion(
                    prepareQuestion(question)
                );

                savedQuestionIds.push(savedQuestion.payload._id);
            }

            const response = await QuizService.createQuiz({
                questions: savedQuestionIds,
                title: title.trim(),
            });

            setAlert({
                status: alertStatuses.SUCCESS,
                text: response.message,
                path: `/quiz/${response.payload._id}`,
            });
        } catch (error) {
            // A quiz that was never created would leave its questions orphaned,
            // so everything created above is removed before the error shows.
            const cleanupResults = await Promise.allSettled(
                savedQuestionIds.map((id) => QuestionService.removeQuestion(id))
            );

            const failedCleanups = cleanupResults.filter(
                (result) => result.status === 'rejected'
            ).length;

            setAlert({
                status: alertStatuses.FAIL,
                text:
                    failedCleanups > 0
                        ? `${getErrorMessage(
                              error
                          )} ${failedCleanups} created question(s) could not be removed and may still exist on the server.`
                        : getErrorMessage(error),
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
                        value={countInput}
                        onChange={(event) =>
                            setQuestionsCount(event.target.value)
                        }
                    />
                </div>
                <div ref={listRef} className="flex flex-col gap-4">
                    {visibleQuestions.map((question) => (
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
                    <Button variant="destructive" onClick={clearQuestions}>
                        <TrashIcon />
                        Clear questions
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
