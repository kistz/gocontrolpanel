import { Control, FieldError, FieldValues, Merge, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import RenderInput from "./render-input";

interface FormElementProps<TControl extends FieldValues> {
  control: Control<TControl>;
  name: Path<TControl>;
  label: string;
  description?: string;
  placeholder?: string;
  type?: string;
  options?: { label: string; value: string }[];
  isRequired?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  isLoading?: boolean;
  step?: string;
  error?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
  className?: string;
  children?: React.ReactNode;
}

export default function FormElement<TControl extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  type = "text",
  options,
  isRequired = false,
  isDisabled = false,
  isHidden = false,
  isLoading = false,
  step,
  error,
  className,
  children,
}: FormElementProps<TControl & FieldValues>) {
  if (isHidden) return null;

  const getErrorMessage = (
    error: FieldError | Merge<FieldError, (FieldError | undefined)[]> | undefined
  ): string | undefined => {
    if (!error) return undefined;
  
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  
    return Array.isArray(error)
      ? error.map((e) => e?.message).filter(Boolean).join(", ")
      : undefined;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm flex items-end" data-error={false}>
            {label}{" "}
            {isRequired && (
              <span className="text-xs text-muted-foreground">(Required)</span>
            )}
          </FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <div className="flex gap-2">
              <RenderInput
                field={field}
                type={type}
                name={name}
                label={label}
                placeholder={placeholder}
                options={options}
                isDisabled={isDisabled || isLoading}
                isLoading={isLoading}
                step={step}
                error={error}
                className={className}
              />

              {children}
            </div>
          </FormControl>
          {error && (
            <FormMessage className="text-destructive">
              {getErrorMessage(error)}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}
