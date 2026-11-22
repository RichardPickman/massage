import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AnswerWithCheckbox } from '../../../components/AnswerWithCheckbox';
import { FileUpload } from '../../../components/FileUpload';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import type { Answer } from '../../../services/models';
import {
    getObjectWithId,
    MAX_ANSWERS,
    MAX_CORRECT,
    MIN_ANSWERS,
    type ConstructorQuestion,
    type QuestionProblem,
} from '../helpers';

interface QuestionConstructorProps {
    questionId: string;
    questionData: ConstructorQuestion;
    // The card's own problem list, so each message can sit next to the field
    // that caused it instead of only in a banner at the top of the page.
    problems?: QuestionProblem[];
    updateQuestion: (id: string, data: Partial<ConstructorQuestion>) => void;
}

export const QuestionConstructor = ({
    questionData,
    questionId,
    problems,
    updateQuestion,
}: QuestionConstructorProps) => {
    const { t } = useTranslation();
    const [question, setQuestion] = useState(questionData.question);
    const [answers, setAnswers] = useState<Answer[]>(questionData.answers);
    const [image, setImage] = useState<File | null>(questionData.img);
    const [correctAnswers, setCorrectAnswers] = useState(
        questionData.correctAnswers
    );

    const [limitNotice, setLimitNotice] = useState(false);

    const textProblem = problems?.includes('text') ?? false;
    const answersProblem =
        problems?.find(
            (problem) => problem === 'minAnswers' || problem === 'maxAnswers'
        ) ?? null;
    const correctProblem = problems?.includes('minCorrect') ?? false;

    const problemMessage = (problem: QuestionProblem) => {
        if (problem === 'text') {
            return t('constructor.problems.text');
        }

        if (problem === 'minAnswers') {
            return t('constructor.problems.minAnswers', {
                count: MIN_ANSWERS,
            });
        }

        if (problem === 'maxAnswers') {
            return t('constructor.problems.maxAnswers', {
                count: MAX_ANSWERS,
            });
        }

        if (problem === 'minCorrect') {
            return t('constructor.problems.minCorrect');
        }

        return t('constructor.problems.maxCorrect', { count: MAX_CORRECT });
    };

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
            setLimitNotice(true);
            return;
        }

        setLimitNotice(false);

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
                <Label htmlFor={`question-${questionId}`}>
                    {t('constructor.form.question')}
                </Label>
                <Input
                    id={`question-${questionId}`}
                    value={question}
                    onChange={handleQuestion}
                    placeholder={t('constructor.form.questionPlaceholder')}
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
                        {problemMessage('text')}
                    </p>
                ) : null}
            </div>
            <FileUpload
                image={imagePreview}
                text={image ? image.name : t('upload.unnamedFile')}
                onSelectFile={handleImageFile}
                removeImage={handleImageRemove}
            />
            {limitNotice ? (
                <p role="alert" className="text-xs text-destructive">
                    {t('constructor.limits.correct', { count: MAX_CORRECT })}
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
                <p className="text-xs text-destructive">
                    {problemMessage('minCorrect')}
                </p>
            ) : null}
            <p
                className={
                    answersProblem
                        ? 'text-xs text-destructive'
                        : 'text-xs text-muted-foreground'
                }
            >
                {answersProblem
                    ? problemMessage(answersProblem)
                    : t('constructor.form.answersHint', { max: MAX_ANSWERS })}
            </p>
        </div>
    );
};
