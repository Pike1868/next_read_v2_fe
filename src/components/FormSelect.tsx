import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type SelectInputProps = {
    name: string;
    label?: string;
    defaultValue?: string;
    options: string[];
    onChange: (value: string) => void;
};

export default function FormSelect({
    label,
    name,
    options,
    defaultValue,
    onChange,
}: SelectInputProps) {
    return (
        <div className="w-full mb-2">
            <Label htmlFor={name} className="text-white capitalize">
                {label || name}
            </Label>
            <Select
                defaultValue={defaultValue || options[0]}
                name={name}
                onValueChange={onChange}
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
