import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BookFilterOptions } from "@/types/books";

type SelectInputProps = {
    name: string;
    label?: string;
    value: BookFilterOptions;
    options: BookFilterOptions[];
    onChange: (value: BookFilterOptions) => void;
};

export default function FormSelect({
    label,
    name,
    options,
    value,
    onChange,
}: SelectInputProps) {
    return (
        <div className="w-full mb-2">
            <Label htmlFor={name} className="text-white capitalize">
                {label || name}
            </Label>
            <Select
                value={value}
                name={name}
                onValueChange={(value) => onChange(value as BookFilterOptions)}
            >
                <SelectTrigger id={name}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((item) => {
                        return (
                            <SelectItem key={item} value={item}>
                                {item}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}
