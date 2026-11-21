import { Button } from '../../ui/button';
import { answerRowClass } from '../answerRow';
import type { AnswerButtonState } from '../index';

interface ShowAnswerProps {
    state: AnswerButtonState;
}

export const ShowAnswer = ({ state }: ShowAnswerProps) => {
    const isCorrect = state.correctAnswers.includes(state.answer.id);

    if (isCorrect) {
        return (
            <Button variant="secondary" className={answerRowClass}>
                {state.answer.text}
            </Button>
        );
    }

    return (
        <Button variant="outline" className={answerRowClass} disabled>
            {state.answer.text}
        </Button>
    );
};
