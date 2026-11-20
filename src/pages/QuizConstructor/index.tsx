import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FloppyDiskIcon, PlusIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { AlertWithLink } from '../../components/AlertWithLink';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import QuestionService from '../../services/Question';
import QuizService from '../../services/Quiz';
import { getErrorMessage } from '../../services/errors';
import { alertStatuses, type AlertStatus } from '../../utils/consts';
import {
    clearDraft,
    loadDraft,
    saveDraft,
    type ConstructorDraft,
} from './draft';
import { QuestionTemplate } from './template';
import {
    DEFAULT_THRESHOLD,
    getObjectWithId,
    prepareQuestion,
    questionProblems,
    questionTemp,
    thresholdProblem,
    type ConstructorQuestion,
} from './helpers';

interface ConstructorAlert {
    status: AlertStatus;
    text: string;
    path?: string;
}

const DRAFT_AUTOSAVE_MS = 400;

const getBlankQuestion = (): ConstructorQuestion =>
    getObjectWithId({
        ...questionTemp,
        answers: questionTemp.answers.map((answer) =>
            getObjectWithId({ text: answer.text })
        ),
    });

const toDraftQuestions = (questions: ConstructorQuestion[]) =>
    questions.map((question) => ({
        id: question.id,
        question: question.question,
        answers: question.answers,
        correctAnswers: question.correctAnswers,
    }));

export const QuizConstructor = () => {
    const [title, setTitle] = useState('');
    const [threshold, setThreshold] = useState(String(DEFAULT_THRESHOLD));
    // The first card exists from the start: the author should see what a
    // question looks like before deciding to add another one.
    const [questions, setQuestions] = useState<ConstructorQuestion[]>([
        getBlankQuestion(),
    ]);
    const [problems, setProblems] = useState<Record<string, string[]>>({});
    const [thresholdError, setThresholdError] = useState<string | null>(null);
    const [titleError, setTitleError] = useState<string | null>(null);
    const [alert, setAlert] = useState<ConstructorAlert | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [draftOffer, setDraftOffer] = useState<ConstructorDraft | null>(null);

    const restoredRef = useRef(false);
    const alertRef = useRef<HTMLDivElement>(null);
    const [listRef] = useAutoAnimate();

    // Offered, never applied silently: restoring without asking would put the
    // author into yesterday's quiz believing they started a new one.
    useEffect(() => {
        setDraftOffer(loadDraft());
    }, []);

    useEffect(() => {
        if (draftOffer) {
            return;
        }

        const timer = setTimeout(() => {
            saveDraft({
                title,
                threshold,
                questions: toDraftQuestions(questions),
            });
        }, DRAFT_AUTOSAVE_MS);

        return () => clearTimeout(timer);
    }, [title, threshold, questions, draftOffer]);

    const updateQuestion = (id: string, data: Partial<ConstructorQuestion>) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((item) =>
                item.id === id ? { ...item, ...data } : item
            )
        );

        // Fixing a card clears its complaint without waiting for another save.
        setProblems((prev) => {
            if (!prev[id]) {
                return prev;
            }

            const next = { ...prev };
            delete next[id];

            return next;
        });
    };

    const addQuestion = () => {
        setQuestions((prevQuestions) => [...prevQuestions, getBlankQuestion()]);
    };

    const removeQuestion = (id: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.filter((item) => item.id !== id)
        );
        setProblems((prev) => {
            const next = { ...prev };
            delete next[id];

            return next;
        });
    };

    const restoreDraft = () => {
        if (!draftOffer) {
            return;
        }

        restoredRef.current = true;
        setTitle(draftOffer.title);
        setThreshold(draftOffer.threshold || String(DEFAULT_THRESHOLD));
        setQuestions(
            draftOffer.questions.map((question) => ({
                ...question,
                // Images cannot be stored in a draft; they are re-attached by
                // hand, and the restored card says so by simply being empty.
                img: null,
                isPreview: false,
            }))
        );
        setDraftOffer(null);
    };

    const discardDraft = () => {
        clearDraft();
        setDraftOffer(null);
    };

    const saveQuiz = async () => {
        setAlert(null);

        // Everything is evaluated before anything is reported: a form that shows
        // one problem at a time makes the author save, fix, save, fix.
        const nextProblems: Record<string, string[]> = {};

        questions.forEach((question) => {
            const found = questionProblems(question);

            if (found.length) {
                nextProblems[question.id] = found;
            }
        });

        setProblems(nextProblems);

        const titleIssue = title.trim() ? null : 'Quiz title cannot be empty';
        setTitleError(titleIssue);

        const thresholdIssue = thresholdProblem(threshold);
        setThresholdError(thresholdIssue);

        const hasCardProblems = Object.keys(nextProblems).length > 0;

        if (hasCardProblems || !title.trim() || thresholdIssue) {
            // The banner says what happened, the field says what to fix. Naming
            // the field twice - once under the input, once up here - teaches the
            // author to stop reading both.
            setAlert({
                status: alertStatuses.FAIL,
                text: 'Check the highlighted fields before saving',
            });

            // A banner at the top is not feedback if the author is looking at
            // question four: take them to the first field that actually blocks.
            requestAnimationFrame(() => {
                const firstInvalid = document.querySelector<HTMLElement>(
                    '[aria-invalid="true"]'
                );

                firstInvalid?.scrollIntoView?.({
                    block: 'center',
                    behavior: 'smooth',
                });
                firstInvalid?.focus?.({ preventScroll: true });
            });

            return;
        }

        if (questions.length === 0) {
            setAlert({
                status: alertStatuses.FAIL,
                text: 'Add at least one question',
            });

            return;
        }

        setIsSaving(true);

        const savedQuestionIds: string[] = [];

        try {
            // One at a time, so a failure leaves a known set to roll back rather
            // than the orphans a rejected Promise.all would leave behind.
            for (const question of questions) {
                const savedQuestion = await QuestionService.createQuestion(
                    prepareQuestion(question)
                );

                savedQuestionIds.push(savedQuestion.payload._id);
            }

            const response = await QuizService.createQuiz({
                questions: savedQuestionIds,
                title: title.trim(),
                threshold: Number(threshold),
            });

            // The quiz exists now, so the draft is redundant. Failing to remove
            // it is harmless: it expires on its own.
            clearDraft();

            setAlert({
                status: alertStatuses.SUCCESS,
                text: response.message,
                path: `/quiz/${response.payload._id}`,
            });

            // Save lives in the header: if the author pressed it from the bottom
            // of a long form, the confirmation has to come to them.
            requestAnimationFrame(() =>
                alertRef.current?.scrollIntoView?.({
                    block: 'nearest',
                    behavior: 'smooth',
                })
            );
        } catch (error) {
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
            restoredRef.current = false;
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                kicker="Editor"
                title="Quiz constructor"
                description="Write the questions, tick the correct answers and set the pass mark. Students only see the answers after they submit."
                meta={
                    <Button disabled={isSaving} onClick={saveQuiz}>
                        <FloppyDiskIcon />
                        {isSaving ? 'Saving...' : 'Save quiz'}
                    </Button>
                }
            />
            <div className="flex flex-col gap-4">
                {draftOffer ? (
                    <div
                        role="status"
                        className="flex flex-col gap-2 rounded-md border border-amber-500/40 bg-amber-50 p-3 text-sm dark:bg-amber-950/30"
                    >
                        <p className="font-medium">
                            Unsaved draft from{' '}
                            {new Date(draftOffer.savedAt).toLocaleDateString()}
                        </p>
                        <p className="text-muted-foreground">
                            {draftOffer.questions.length} question(s),{' '}
                            {draftOffer.title.trim()
                                ? `title “${draftOffer.title}”`
                                : 'no title yet'}
                            . Images are not kept in a draft.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={restoreDraft}>
                                Restore draft
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={discardDraft}
                            >
                                Start fresh
                            </Button>
                        </div>
                    </div>
                ) : null}

                <div ref={alertRef}>
                    {alert ? (
                        <AlertWithLink
                            status={alert.status}
                            text={alert.text}
                            path={alert.path}
                            title="Open quiz"
                            onClose={() => setAlert(null)}
                        />
                    ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="quiz-title">Quiz title</Label>
                        <Input
                            id="quiz-title"
                            value={title}
                            aria-invalid={titleError ? true : undefined}
                            aria-describedby={
                                titleError ? 'quiz-title-error' : undefined
                            }
                            onChange={(event) => {
                                setTitle(event.target.value);
                                setTitleError(null);
                            }}
                            placeholder="e.g. Anatomy — week 3"
                        />
                        {titleError ? (
                            <p
                                id="quiz-title-error"
                                className="text-xs text-destructive"
                            >
                                {titleError}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex w-full flex-col gap-1">
                        <Label htmlFor="quiz-threshold">
                            Pass threshold, %
                        </Label>
                        <Input
                            id="quiz-threshold"
                            type="number"
                            inputMode="numeric"
                            min={0}
                            max={100}
                            step={1}
                            value={threshold}
                            aria-invalid={thresholdError ? true : undefined}
                            aria-describedby={
                                thresholdError
                                    ? 'quiz-threshold-error'
                                    : undefined
                            }
                            onChange={(event) => {
                                setThreshold(event.target.value);
                                setThresholdError(null);
                            }}
                        />
                        {thresholdError ? (
                            <p
                                id="quiz-threshold-error"
                                className="text-xs text-destructive"
                            >
                                {thresholdError}
                            </p>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                Students need at least this score to pass.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                    <h2 className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                        Questions
                    </h2>
                    <span className="text-xs text-muted-foreground">
                        {questions.length} question
                        {questions.length === 1 ? '' : 's'} in this quiz
                    </span>
                </div>

                <div ref={listRef} className="flex flex-col gap-4">
                    {questions.map((question, index) => (
                        <QuestionTemplate
                            key={question.id}
                            questionData={question}
                            questionNumber={index + 1}
                            problems={problems[question.id]}
                            updateQuestion={updateQuestion}
                            removeQuestion={removeQuestion}
                        />
                    ))}
                </div>

                <Button
                    variant="outline"
                    className="min-h-12 w-full border-dashed"
                    onClick={addQuestion}
                    disabled={isSaving}
                >
                    <PlusIcon />
                    Add question
                </Button>
            </div>
        </div>
    );
};
