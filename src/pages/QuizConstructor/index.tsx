import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FloppyDiskIcon, PlusIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertWithLink } from '../../components/AlertWithLink';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import QuestionService from '../../services/Question';
import QuizService from '../../services/Quiz';
import { describeServerMessage } from '../../i18n/serverMessages';
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
    type QuestionProblem,
    type ThresholdProblem,
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
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [threshold, setThreshold] = useState(String(DEFAULT_THRESHOLD));
    // The first card exists from the start: the author should see what a
    // question looks like before deciding to add another one.
    const [questions, setQuestions] = useState<ConstructorQuestion[]>([
        getBlankQuestion(),
    ]);
    const [problems, setProblems] = useState<Record<string, QuestionProblem[]>>(
        {}
    );
    const [thresholdError, setThresholdError] =
        useState<ThresholdProblem | null>(null);
    const [titleError, setTitleError] = useState<'required' | null>(null);
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

    const thresholdMessage = (problem: ThresholdProblem) => {
        if (problem === 'number') {
            return t('constructor.threshold.number');
        }

        if (problem === 'whole') {
            return t('constructor.threshold.whole');
        }

        return t('constructor.threshold.range');
    };

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
        const nextProblems: Record<string, QuestionProblem[]> = {};

        questions.forEach((question) => {
            const found = questionProblems(question);

            if (found.length) {
                nextProblems[question.id] = found;
            }
        });

        setProblems(nextProblems);

        const titleIssue: 'required' | null = title.trim() ? null : 'required';
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
                text: t('constructor.checkFields'),
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
                text: t('constructor.addQuestionRequired'),
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
                text: describeServerMessage(response.code, response.message),
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
                        ? `${getErrorMessage(error)} ${t(
                              'constructor.cleanupFailed',
                              { count: failedCleanups }
                          )}`
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
                kicker={t('constructor.kicker')}
                title={t('constructor.title')}
                description={t('constructor.description')}
                meta={
                    <Button disabled={isSaving} onClick={saveQuiz}>
                        <FloppyDiskIcon />
                        {isSaving ? t('common.saving') : t('constructor.save')}
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
                            {t('constructor.draft.title', {
                                date: new Date(
                                    draftOffer.savedAt
                                ).toLocaleDateString(),
                            })}
                        </p>
                        <p className="text-muted-foreground">
                            {t('constructor.draft.questions', {
                                count: draftOffer.questions.length,
                            })}
                            ,{' '}
                            {draftOffer.title.trim()
                                ? t('constructor.draft.titled', {
                                      title: draftOffer.title,
                                  })
                                : t('constructor.draft.untitled')}
                            . {t('constructor.draft.noImages')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={restoreDraft}>
                                {t('constructor.draft.restore')}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={discardDraft}
                            >
                                {t('constructor.draft.fresh')}
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
                            title={t('constructor.openQuiz')}
                            onClose={() => setAlert(null)}
                        />
                    ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="quiz-title">
                            {t('constructor.field.title')}
                        </Label>
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
                            placeholder={t(
                                'constructor.field.titlePlaceholder'
                            )}
                        />
                        {titleError ? (
                            <p
                                id="quiz-title-error"
                                className="text-xs text-destructive"
                            >
                                {t('constructor.field.titleRequired')}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex w-full flex-col gap-1">
                        <Label htmlFor="quiz-threshold">
                            {t('constructor.field.threshold')}
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
                                {thresholdMessage(thresholdError)}
                            </p>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                {t('constructor.field.thresholdHint')}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                    <h2 className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                        {t('constructor.questions.heading')}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                        {t('constructor.questions.count', {
                            count: questions.length,
                        })}
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
                    {t('constructor.addQuestion')}
                </Button>
            </div>
        </div>
    );
};
