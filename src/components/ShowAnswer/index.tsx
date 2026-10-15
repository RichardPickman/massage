import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface ShowAnswersProps {
    showAnswersState: boolean;
    onChange: () => void;
}

export const ShowAnswers = ({
    showAnswersState,
    onChange,
}: ShowAnswersProps) => {
    return (
        <Label className="cursor-pointer gap-2 normal-case tracking-normal">
            <Checkbox checked={showAnswersState} onCheckedChange={onChange} />
            Show answers
        </Label>
    );
};

