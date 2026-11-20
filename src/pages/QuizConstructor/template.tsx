import { useAutoAnimate } from '@formkit/auto-animate/react';
import { PencilIcon, TrashIcon } from '@phosphor-icons/react';
import { memo } from 'react';
import { Question } from '../../components/Question';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
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
            <Card
                className={
                    hasProblems ? 'w-full border-destructive/60' : 'w-full'
                }
                aria-invalid={hasProblems ? true : undefined}
            >
                <div className="flex items-center justify-between border-b px-6 py-3">
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
                        <div className="px-6">
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
                    <ul className="flex flex-col gap-1 px-6 text-xs text-destructive">
                        {problems?.map((problem) => (
                            <li key={problem}>• {problem}</li>
                        ))}
                    </ul>
                ) : null}
                <div className="flex justify-end gap-2 px-6">
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
            </Card>
        );
    }
);

QuestionTemplate.displayName = 'QuestionTemplate';
