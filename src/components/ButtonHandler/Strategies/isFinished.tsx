import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { cn } from 'cn';
import { useTranslation } from 'react-i18next';
import { Button } from '../../ui/button';
import { answerRowClass } from '../answerRow';
import type { AnswerButtonState } from '../index';

interface IsFinishedProps {
    state: AnswerButtonState;
}

// The verdict is otherwise carried by colour alone, which says nothing to a
// screen reader and not enough to a colour-blind student: the icon repeats it and
// the sr-only word names it. These rows are a review, not controls — they leave
// the tab order instead of sitting in it as buttons that do nothing.
export const IsFinished = ({ state }: IsFinishedProps) => {
    const { t } = useTranslation();
    const { currentAnswers, correctAnswers, answer } = state;
    const isCorrect = correctAnswers.includes(answer.id);
    const isSelected = currentAnswers.includes(answer.id);

    if (isCorrect) {
        return (
            <Button
                variant={isSelected ? 'default' : 'secondary'}
                className={cn(answerRowClass, 'cursor-default')}
                tabIndex={-1}
            >
                <span className="min-w-0 flex-1">{answer.text}</span>
                <CheckIcon className="size-5 shrink-0" aria-hidden />
                <span className="sr-only">{t('quiz.correctAnswer')}</span>
            </Button>
        );
    }

    if (isSelected) {
        return (
            <Button
                variant="outline"
                // Red text on a red wash lands at 4.39:1 — under AA and loud at the
                // same time. The border and the cross carry the verdict; the words
                // stay at full contrast.
                className={cn(
                    answerRowClass,
                    'cursor-default border-destructive bg-destructive/10'
                )}
                tabIndex={-1}
            >
                <span className="min-w-0 flex-1">{answer.text}</span>
                <XIcon
                    className="size-5 shrink-0 text-destructive"
                    aria-hidden
                />
                <span className="sr-only">{t('quiz.wrongAnswer')}</span>
            </Button>
        );
    }

    return (
        <Button variant="outline" className={answerRowClass} disabled>
            {answer.text}
        </Button>
    );
};
