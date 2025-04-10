"use client";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";

interface RenderInputProps<TControl extends FieldValues> {
  field: ControllerRenderProps<TControl>;
  type?: string;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  step?: string;
  error?: any;
  className?: string;
}

export default function RenderInput<TControl extends FieldValues>({
    field,
    type,
    name,
    label,
    placeholder,
    options,
    isDisabled = false,
    isLoading = false,
    step,
    error,
    className,
  }: RenderInputProps<TControl & FieldValues>) {
    const [showPassword, setShowPassword] = useState(false);

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
            defaultValue={`${field.value}`}
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
                        field.value.filter(
                          (value: string) => value !== option.value,
                        ),
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
  }