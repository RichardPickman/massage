import { type ChangeEvent, useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AnswerWithCheckboxProps {
    id: string;
    addAnswer: (answer: { id: string; text: string }) => void;
    handleCorrectAnswer: (id: string) => void;
    removeEmpty: (id: string) => void;
    predefinedText: string;
    predefinedCheckbox: boolean;
}

export const AnswerWithCheckbox = ({
    id,
    addAnswer,
    handleCorrectAnswer,
    removeEmpty,
    predefinedText,
    predefinedCheckbox,
}: AnswerWithCheckboxProps) => {
    const [text, setText] = useState(predefinedText);
    const [checked, setChecked] = useState(predefinedCheckbox);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);

        if (!event.target.value) {
            removeEmpty(id);

            return;
        }

        addAnswer({ id, text: event.target.value });
    };

    const handleCorrect = () => {
        setChecked(!checked);
        handleCorrectAnswer(id);
    };

    return (
        <div className="flex flex-col gap-1">
            <Input value={text} onChange={onChange} />
            <Label className="cursor-pointer gap-2 normal-case tracking-normal">
                <Checkbox checked={checked} onCheckedChange={handleCorrect} />
                Correct answer
            </Label>
        </div>
    );
};

