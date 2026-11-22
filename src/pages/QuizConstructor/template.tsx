import { useAutoAnimate } from '@formkit/auto-animate/react';
import { EyeIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Question } from '../../components/Question';
import { Button } from '../../components/ui/button';
import { QuestionConstructor } from './QuestionConstructor';
import type { ConstructorQuestion, QuestionProblem } from './helpers';

interface QuestionTemplateProps {
    questionData: ConstructorQuestion;
    questionNumber: number;
    problems?: QuestionProblem[];
    updateQuestion: (id: string, data: Partial<ConstructorQuestion>) => void;
    removeQuestion: (id: string) => void;
}

export const QuestionTemplate = memo(
    ({
        questionData,
        questionNumber,
        problems,
        updateQuestion,
        removeQuestion,
    }: QuestionTemplateProps) => {
        const { t } = useTranslation();
        const [listRef] = useAutoAnimate();

        const togglePreview = (isPreview: boolean) =>
            updateQuestion(questionData.id, { isPreview });
        const hasProblems = Boolean(problems?.length);

        return (
            // A bordered block, not another Card: the constructor page is a Card
            // already, and a second frame costs 32px of width per side plus the
            // gap that goes with it - on a phone that was most of the card.
            <div
                className={
                    hasProblems
                        ? 'flex w-full flex-col gap-3 rounded-lg border border-destructive/60 py-3'
                        : 'flex w-full flex-col gap-3 rounded-lg border py-3'
                }
                aria-invalid={hasProblems ? true : undefined}
            >
                <div className="flex items-center justify-between gap-2 border-b px-4 py-2 md:px-6 md:py-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold tabular-nums">
                            {questionNumber}
                        </span>
                        <p className="truncate text-sm font-medium">
                            {t('constructor.card.question', {
                                number: questionNumber,
                            })}
                        </p>
                        {hasProblems ? (
                            <span className="text-xs font-medium text-destructive">
                                {t('constructor.card.needsAttention')}
                            </span>
                        ) : null}
                    </div>
                    {questionData.isPreview ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePreview(false)}
                        >
                            <PencilIcon />
                            {t('constructor.card.edit')}
                        </Button>
                    ) : (
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="size-9 text-muted-foreground md:size-8"
                                aria-label={t('constructor.card.preview', {
                                    number: questionNumber,
                                })}
                                onClick={() => togglePreview(true)}
                            >
                                <EyeIcon />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="size-9 text-muted-foreground hover:text-destructive md:size-8"
                                aria-label={t('constructor.card.delete', {
                                    number: questionNumber,
                                })}
                                onClick={() => removeQuestion(questionData.id)}
                            >
                                <TrashIcon />
                            </Button>
                        </div>
                    )}
                </div>
                <div ref={listRef} className="flex flex-col gap-4">
                    {questionData.isPreview ? (
                        <div className="px-4 md:px-6">
                            <Question
                                currentQuestion={questionData}
                                currentState={{
                                    correctAnswers: questionData.correctAnswers,
                                    currentAnswers: [],
                                    isFinished: false,
                                    showAnswers: true,
                                }}
                                onSelect={() => {}}
                            />
                        </div>
                    ) : (
                        <QuestionConstructor
                            questionId={questionData.id}
                            questionData={questionData}
                            problems={problems}
                            updateQuestion={updateQuestion}
                        />
                    )}
                </div>
            </div>
        );
    }
);

QuestionTemplate.displayName = 'QuestionTemplate';
