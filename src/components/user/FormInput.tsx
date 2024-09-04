import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Control, useController, FieldValues, Path } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
    name: Path<T>;
    type: string;
    label?: string;
    control: Control<T>;
};

export default function FormInput<T extends FieldValues>({
    label,
    name,
    type,
    control,
}: FormInputProps<T>) {
    // Use useController hook to connect the input with react-hook-form
    const {
        field,
        fieldState: { error },
    } = useController({ name, control });

    return (
        <div className="mb-2">
            <Label htmlFor={name} className="capitalize">
                {label || name}
            </Label>
            <Input id={name} type={type} {...field} />
            {error && <p className="text-red-600">{error.message}</p>}
        </div>
    );
}
