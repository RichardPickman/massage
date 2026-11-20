import { XIcon } from '@phosphor-icons/react';
import { type ChangeEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';

interface AnswerWithCheckboxProps {
    id: string;
    addAnswer: (answer: { id: string; text: string }) => void;
    handleCorrectAnswer: (id: string) => void;
    removeEmpty: (id: string) => void;
    predefinedText: string;
    predefinedCheckbox: boolean;
    // Position in the list, used for the accessible names.
    number: number;
    // Set when the card is blocked on this answer for being empty.
    invalid?: boolean;
}

export const AnswerWithCheckbox = ({
    id,
    addAnswer,
    handleCorrectAnswer,
    removeEmpty,
    predefinedText,
    predefinedCheckbox,
    number,
    invalid,
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

    // One row per answer: the checkbox marks it correct, the field holds the
    // text, the cross removes it. The old layout stacked the checkbox under the
    // field, which doubled the height of a ten-answer question and read as two
    // unrelated controls.
    return (
        <div
            className={
                invalid
                    ? 'flex items-center gap-2 rounded-md border border-destructive bg-background pr-1 focus-within:ring-[3px] focus-within:ring-destructive/20'
                    : 'flex items-center gap-2 rounded-md border bg-background pr-1 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30'
            }
        >
            <Checkbox
                id={`answer-correct-${id}`}
                checked={checked}
                onCheckedChange={handleCorrect}
                aria-label={`Answer ${number} is correct`}
                className="ml-3 shrink-0"
            />
            <Input
                value={text}
                onChange={onChange}
                aria-label={`Answer ${number}`}
                aria-invalid={invalid ? true : undefined}
                placeholder="Answer text"
                className="h-11 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 md:h-10 dark:bg-transparent"
            />
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove answer ${number}`}
                onClick={() => removeEmpty(id)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
            >
                <XIcon />
            </Button>
        </div>
    );
};
