import { Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import RenderInput from "./render-input";

interface FormElementProps<TControl> {
  name: Path<TControl>;
  label?: string;
  description?: string;
  placeholder?: string;
  type?: string;
  options?: { label: string; value: string; removable?: boolean }[];
  defaultValues?: string[];
  isRequired?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  isLoading?: boolean;
  autoFocus?: boolean;
  step?: string;
  min?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function FormElement<TControl>({
  name,
  label,
  description,
  placeholder,
  type = "text",
  options,
  defaultValues,
  isRequired = false,
  isDisabled = false,
  isHidden = false,
  isLoading = false,
  autoFocus = false,
  step,
  min,
  className,
  children,
}: FormElementProps<TControl>) {
  if (isHidden) return null;

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  const getErrorMessage = (error: any): string | undefined => {
    if (!error) return undefined;

    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }

    return Array.isArray(error)
      ? error
          .map((e) => e?.message)
          .filter(Boolean)
          .join(", ")
      : undefined;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {(label || description) && (
            <div>
              {label && (
                <FormLabel
                  className="text-sm flex items-end"
                  data-error={!!error}
                >
                  {label}{" "}
                  {isRequired && (
                    <span className="text-xs text-muted-foreground">
                      (Required)
                    </span>
                  )}
                </FormLabel>
              )}
              {description && <FormDescription>{description}</FormDescription>}
            </div>
          )}
          <FormControl>
            <div className="flex gap-2">
              <RenderInput
                field={field}
                type={type}
                name={name}
                label={label}
                placeholder={placeholder}
                options={options}
                defaultValues={defaultValues}
                isDisabled={isDisabled || isLoading}
                isLoading={isLoading}
                step={step}
                min={min}
                error={error}
                autoFocus={autoFocus}
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
