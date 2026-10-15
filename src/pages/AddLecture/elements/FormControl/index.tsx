import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface SelectOption {
    value: string;
    label: string;
}

interface FormControlProps {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    emptyHint?: string;
}

// The teacher and lesson collections are optional: when the API exposes no
// options the field falls back to free text, so a lecture can still be saved.
export const FormControl = ({
    label,
    value,
    options,
    onChange,
    emptyHint,
}: FormControlProps) => {
    const fieldId = `lecture-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={fieldId}>{label}</Label>
            {options.length > 0 ? (
                <Select
                    value={value ? value : undefined}
                    onValueChange={onChange}
                >
                    <SelectTrigger id={fieldId}>
                        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                <Input
                    id={fieldId}
                    value={value}
                    placeholder={emptyHint}
                    onChange={(event) => onChange(event.target.value)}
                />
            )}
            {options.length === 0 && emptyHint ? (
                <p className="text-xs text-muted-foreground">{emptyHint}</p>
            ) : null}
        </div>
    );
};

