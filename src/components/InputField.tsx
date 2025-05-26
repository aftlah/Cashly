import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface InputFieldProps {
    label: string
    name: string
    type?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    errors?: string[]
    placeholder?: string
}

export const InputField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    errors,
    placeholder,
}: InputFieldProps) => {
    const hasError = errors && errors.length > 0

    return (
            <div className="space-y-2">
                <Label htmlFor={name} className="block text-lg font-black text-black uppercase mb-2">{label}</Label>
                <Input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                aria-invalid={hasError}
                className={`w-full px-4 py-4 border-4 bg-white text-black font-bold text-lg shadow-[4px_4px_0px_0px_#000000] focus:outline-none focus:shadow-[6px_6px_0px_0px_#000000] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-100 ${hasError ? "border-red-500" : "border-black"}`}
                />
                {hasError && (
                <div className="mt-2 bg-red-300 border-2 border-red-500 px-3 py-2">
                    {errors?.map((err, idx) => (
                    <p key={idx} className="text-red-800 font-bold text-sm uppercase">
                        {err}
                    </p>
                    ))}
                </div>
                )}
            </div>
    )
}
