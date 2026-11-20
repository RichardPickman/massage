import type { Answer } from '../../services/models';
import { Button } from '../ui/button';
import { IsFinished } from './Strategies/isFinished';
import { ShowAnswer } from './Strategies/showAnswer';

export interface QuestionViewState {
    correctAnswers: string[];
    currentAnswers: string[];
    isFinished: boolean;
    showAnswers: boolean;
}

export interface AnswerButtonState extends QuestionViewState {
    answer: Answer;
    onSelect: (id: string) => void;
}

interface ButtonHandlerProps {
    state: AnswerButtonState;
}

export const ButtonHandler = ({ state }: ButtonHandlerProps) => {
    const { isFinished, showAnswers, answer, currentAnswers, onSelect } = state;

    if (showAnswers) {
        return <ShowAnswer state={state} />;
    }

    if (isFinished) {
        return <IsFinished state={state} />;
    }

    const isSelected = currentAnswers.includes(answer.id);

    return (
        <Button
            variant={isSelected ? 'default' : 'outline'}
            className="h-auto min-h-14 w-full justify-start py-3 text-left text-base leading-snug whitespace-normal"
            onClick={() => onSelect(answer.id)}
        >
            {answer.text}
        </Button>
    );
};
