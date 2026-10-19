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
    updateQuestion: (id: string, data: Partial<ConstructorQuestion>) => void;
    removeQuestion: (id: string) => void;
}

export const QuestionTemplate = memo(
    ({
        questionData,
        updateQuestion,
        removeQuestion,
    }: QuestionTemplateProps) => {
        const [listRef] = useAutoAnimate();

        const togglePreview = (isPreview: boolean) =>
            updateQuestion(questionData.id, { isPreview });

        return (
            <Card className="w-full">
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
