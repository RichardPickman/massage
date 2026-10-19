import { useAutoAnimate } from '@formkit/auto-animate/react';
import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { AnswerWithCheckbox } from '../../../components/AnswerWithCheckbox';
import { FileUpload } from '../../../components/FileUpload';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import type { Answer } from '../../../services/models';
import { getObjectWithId, type ConstructorQuestion } from '../helpers';

interface QuestionConstructorProps {
    questionId: string;
    questionData: ConstructorQuestion;
    updateQuestion: (id: string, data: Partial<ConstructorQuestion>) => void;
}

export const QuestionConstructor = ({
    questionData,
    questionId,
    updateQuestion,
}: QuestionConstructorProps) => {
    const [question, setQuestion] = useState(questionData.question);
    const [answers, setAnswers] = useState<Answer[]>(questionData.answers);
    const [image, setImage] = useState<File | null>(questionData.img);
    const [correctAnswers, setCorrectAnswers] = useState(
        questionData.correctAnswers
    );

    const [listRef] = useAutoAnimate();

    const imagePreview = useMemo(
        () => (image ? window.URL.createObjectURL(image) : null),
        [image]
    );

    useEffect(
        () => () => {
            if (imagePreview) {
                window.URL.revokeObjectURL(imagePreview);
            }
        },
        [imagePreview]
    );

    const addAnswer = (answer: Answer) => {
        const answersCopy = answers.map((item) =>
            item.id === answer.id ? answer : item
        );

        const lastAnswer = answersCopy[answersCopy.length - 1];

        if (lastAnswer && lastAnswer.text) {
            answersCopy.push(getObjectWithId({ text: '' }));
        }

        setAnswers(answersCopy);
        updateQuestion(questionId, { answers: answersCopy });
    };

    const handleCorrectAnswer = (id: string) => {
        const correctAnswersCopy = correctAnswers.includes(id)
            ? correctAnswers.filter((item) => item !== id)
            : [...correctAnswers, id];

        setCorrectAnswers(correctAnswersCopy);
        updateQuestion(questionId, { correctAnswers: correctAnswersCopy });
    };

    const removeEmpty = (answerId: string) => {
        const filterAnswers = answers.filter((item) => item.id !== answerId);
        const filterCorrectAnswers = correctAnswers.filter(
            (item) => item !== answerId
        );

        setAnswers(filterAnswers);
        setCorrectAnswers(filterCorrectAnswers);

        updateQuestion(questionId, {
            answers: filterAnswers,
            correctAnswers: filterCorrectAnswers,
        });
    };

    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;

        setImage(file);
        updateQuestion(questionId, { img: file });
    };

    const handleImageRemove = () => {
        setImage(null);
        updateQuestion(questionId, { img: null });
    };

    const handleQuestion = (event: ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value);
        updateQuestion(questionId, { question: event.target.value });
    };

    return (
        <div ref={listRef} className="flex flex-col gap-4 px-6">
            <div className="flex flex-col gap-1">
                <Label htmlFor={`question-${questionId}`}>Question</Label>
                <Input
                    id={`question-${questionId}`}
                    value={question}
                    onChange={handleQuestion}
                />
            </div>
            <FileUpload
                image={imagePreview}
                text={image ? image.name : 'File unnamed'}
                handleImage={handleImage}
                removeImage={handleImageRemove}
            />
            <div className="grid gap-2 sm:grid-cols-2">
                {answers.map((answer) => (
                    <AnswerWithCheckbox
                        key={answer.id}
                        id={answer.id}
                        removeEmpty={removeEmpty}
                        addAnswer={addAnswer}
                        handleCorrectAnswer={handleCorrectAnswer}
                        predefinedText={answer.text}
                        predefinedCheckbox={correctAnswers.includes(answer.id)}
                    />
                ))}
            </div>
        </div>
    );
};

