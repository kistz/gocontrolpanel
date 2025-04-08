import { cn } from "@/lib/utils";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
import {
  Control,
  ControllerRenderProps,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
  error?: FieldError;
  className?: string;
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
}: FormElementProps<TControl & FieldValues>) {
  if (isHidden) return null;

  const [showPassword, setShowPassword] = useState(false);

  const RenderInput = ({
    field,
    className,
  }: {
    field: ControllerRenderProps<TControl>;
    className?: string;
  }) => {
    switch (type) {
      case "text":
      case "number":
        return (
          <Input
            type={type}
            placeholder={placeholder}
            disabled={isDisabled || isLoading}
            {...field}
            className={className}
            error={!!error}
            step={step}
          />
        );
      case "password":
        return (
          <div className={cn("relative", className)}>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              disabled={isDisabled || isLoading}
              {...field}
              className={"pr-10"}
              error={!!error}
            />
            <Button
              variant={null}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </Button>
          </div>
        );
      case "select":
        return (
          <Select
            onValueChange={field.onChange}
            {...field}
            disabled={isDisabled || isLoading}
          >
            <SelectTrigger className={className}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              disabled={isDisabled || isLoading}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={name} className="text-sm">
              {label}
            </label>
          </div>
        );
      case "pair-list":
        return (
          <div className="flex flex-col gap-2">
            {options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${name}-${option.value}`}
                  disabled={isDisabled || isLoading}
                  checked={field.value.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      field.onChange([...field.value, option.value]);
                    } else {
                      field.onChange(
                        field.value.filter((value: string) => value !== option.value)
                      );
                    }
                  }}
                />
                <label htmlFor={`${name}-${option.value}`} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            disabled={isDisabled || isLoading}
            {...field}
            error={!!error}
            className={className}
          />
        );
    }
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
            <RenderInput field={field} className={className} />
          </FormControl>
          {error && (
            <FormMessage className="text-destructive">
              {error.message}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}
