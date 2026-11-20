import { useAutoAnimate } from '@formkit/auto-animate/react';
import { PencilIcon, TrashIcon } from '@phosphor-icons/react';
import { memo } from 'react';
import { Question } from '../../components/Question';
import { Button } from '../../components/ui/button';
import { QuestionConstructor } from './QuestionConstructor';
import type { ConstructorQuestion } from './helpers';

interface QuestionTemplateProps {
    questionData: ConstructorQuestion;
    questionNumber: number;
    problems?: string[];
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
                <div className="flex items-center justify-between border-b px-4 py-2 md:px-4 md:px-6 md:py-3">
                    <p className="text-sm font-medium">
                        Question {questionNumber}
                    </p>
                    {hasProblems ? (
                        <span className="text-xs font-medium text-destructive">
                            Needs attention
                        </span>
                    ) : null}
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
                            updateQuestion={updateQuestion}
                        />
                    )}
                </div>
                {hasProblems ? (
                    <ul className="flex flex-col gap-1 px-4 md:px-6 text-xs text-destructive">
                        {problems?.map((problem) => (
                            <li key={problem}>• {problem}</li>
                        ))}
                    </ul>
                ) : null}
                <div className="flex justify-end gap-2 px-4 md:px-6">
                    {questionData.isPreview ? (
                        <Button
                            variant="outline"
                            onClick={() => togglePreview(false)}
                        >
                            <PencilIcon />
                            Edit
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="secondary"
                                onClick={() => togglePreview(true)}
                            >
                                Preview
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => removeQuestion(questionData.id)}
                            >
                                <TrashIcon />
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>
        );
    }
);

QuestionTemplate.displayName = 'QuestionTemplate';
