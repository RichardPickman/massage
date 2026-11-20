import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { AnswerWithCheckbox } from '../../../components/AnswerWithCheckbox';
import { FileUpload } from '../../../components/FileUpload';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import type { Answer } from '../../../services/models';
import {
    getObjectWithId,
    MAX_ANSWERS,
    MAX_CORRECT,
    type ConstructorQuestion,
} from '../helpers';

interface QuestionConstructorProps {
    questionId: string;
    questionData: ConstructorQuestion;
    // The card's own problem list, so each message can sit next to the field
    // that caused it instead of only in a banner at the top of the page.
    problems?: string[];
    updateQuestion: (id: string, data: Partial<ConstructorQuestion>) => void;
}

export const QuestionConstructor = ({
    questionData,
    questionId,
    problems,
    updateQuestion,
}: QuestionConstructorProps) => {
    const [question, setQuestion] = useState(questionData.question);
    const [answers, setAnswers] = useState<Answer[]>(questionData.answers);
    const [image, setImage] = useState<File | null>(questionData.img);
    const [correctAnswers, setCorrectAnswers] = useState(
        questionData.correctAnswers
    );

    const [limitNotice, setLimitNotice] = useState<string | null>(null);

    const textProblem = problems?.includes('Add the question text')
        ? 'Add the question text'
        : null;
    const answersProblem =
        problems?.find((problem) => problem.startsWith('Fill at least')) ??
        null;
    const correctProblem = problems?.includes(
        'Mark at least one correct answer'
    )
        ? 'Mark at least one correct answer'
        : null;

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

        // Stop growing at the limit instead of silently ignoring keystrokes: a
        // row that never appears reads like a broken input.
        if (lastAnswer && lastAnswer.text && answersCopy.length < MAX_ANSWERS) {
            answersCopy.push(getObjectWithId({ text: '' }));
        }

        setAnswers(answersCopy);
        updateQuestion(questionId, { answers: answersCopy });
    };

    const handleCorrectAnswer = (id: string) => {
        const alreadyCorrect = correctAnswers.includes(id);

        if (!alreadyCorrect && correctAnswers.length >= MAX_CORRECT) {
            setLimitNotice(
                `At most ${MAX_CORRECT} correct answers per question`
            );
            return;
        }

        setLimitNotice(null);

        const correctAnswersCopy = alreadyCorrect
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

    const handleImageFile = (file: File | null) => {
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
        <div ref={listRef} className="flex flex-col gap-4 px-4 md:px-6">
            <div className="flex flex-col gap-1">
                <Label htmlFor={`question-${questionId}`}>Question</Label>
                <Input
                    id={`question-${questionId}`}
                    value={question}
                    onChange={handleQuestion}
                    placeholder="What should the student be asked?"
                    aria-invalid={textProblem ? true : undefined}
                    aria-describedby={
                        textProblem ? `question-${questionId}-error` : undefined
                    }
                />
                {textProblem ? (
                    <p
                        id={`question-${questionId}-error`}
                        className="text-xs text-destructive"
                    >
                        {textProblem}
                    </p>
                ) : null}
            </div>
            <FileUpload
                image={imagePreview}
                text={image ? image.name : 'File unnamed'}
                onSelectFile={handleImageFile}
                removeImage={handleImageRemove}
            />
            {limitNotice ? (
                <p role="alert" className="text-xs text-destructive">
                    {limitNotice}
                </p>
            ) : null}
            <div className="flex flex-col gap-2">
                {answers.map((answer, index) => (
                    <AnswerWithCheckbox
                        key={answer.id}
                        id={answer.id}
                        number={index + 1}
                        removeEmpty={removeEmpty}
                        addAnswer={addAnswer}
                        handleCorrectAnswer={handleCorrectAnswer}
                        predefinedText={answer.text}
                        predefinedCheckbox={correctAnswers.includes(answer.id)}
                        invalid={Boolean(answersProblem) && !answer.text.trim()}
                    />
                ))}
            </div>
            {correctProblem ? (
                <p className="text-xs text-destructive">{correctProblem}</p>
            ) : null}
            <p
                className={
                    answersProblem
                        ? 'text-xs text-destructive'
                        : 'text-xs text-muted-foreground'
                }
            >
                {answersProblem ??
                    `Two to ${MAX_ANSWERS} answers, at least one marked correct.`}
            </p>
        </div>
    );
};
