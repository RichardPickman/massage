import { Button } from '../../ui/button';
import { answerRowClass } from '../answerRow';
import type { AnswerButtonState } from '../index';

interface IsFinishedProps {
    state: AnswerButtonState;
}

export const IsFinished = ({ state }: IsFinishedProps) => {
    const { currentAnswers, correctAnswers, answer } = state;
    const isCorrect = correctAnswers.includes(answer.id);
    const isSelected = currentAnswers.includes(answer.id);

    if (isCorrect) {
        return (
            <Button
                variant={isSelected ? 'default' : 'secondary'}
                className={answerRowClass}
            >
                {answer.text}
            </Button>
        );
    }

    if (isSelected) {
        return (
            <Button variant="destructive" className={answerRowClass}>
                {answer.text}
            </Button>
        );
    }

    return (
        <Button variant="outline" className={answerRowClass} disabled>
            {answer.text}
        </Button>
    );
};
