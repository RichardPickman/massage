import { CheckIcon } from '@phosphor-icons/react';
import { cn } from 'cn';
import { useTranslation } from 'react-i18next';
import { Button } from '../../ui/button';
import { answerRowClass } from '../answerRow';
import type { AnswerButtonState } from '../index';

interface ShowAnswerProps {
    state: AnswerButtonState;
}

// Same reasoning as the finished review: the right answer is marked by colour,
// so it is marked by an icon and a word as well, and it is not a control.
export const ShowAnswer = ({ state }: ShowAnswerProps) => {
    const { t } = useTranslation();
    const isCorrect = state.correctAnswers.includes(state.answer.id);

    if (isCorrect) {
        return (
            <Button
                variant="secondary"
                className={cn(answerRowClass, 'cursor-default')}
                tabIndex={-1}
            >
                <span className="min-w-0 flex-1">{state.answer.text}</span>
                <CheckIcon className="size-5 shrink-0" aria-hidden />
                <span className="sr-only">{t('quiz.correctAnswer')}</span>
            </Button>
        );
    }

    return (
        <Button variant="outline" className={answerRowClass} disabled>
            {state.answer.text}
        </Button>
    );
};
