import { Button } from '../../ui/button';
import type { AnswerButtonState } from '../index';

interface ShowAnswerProps {
    state: AnswerButtonState;
}

export const ShowAnswer = ({ state }: ShowAnswerProps) => {
    const isCorrect = state.correctAnswers.includes(state.answer.id);

    if (isCorrect) {
        return (
            <Button variant="secondary" className="w-full justify-start">
                {state.answer.text}
            </Button>
        );
    }

    return (
        <Button variant="outline" className="w-full justify-start" disabled>
            {state.answer.text}
        </Button>
    );
};

