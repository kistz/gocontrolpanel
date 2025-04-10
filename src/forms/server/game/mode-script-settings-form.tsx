"use client";

import { setModeScriptSettings } from "@/actions/gbx/game";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { ModeScriptInfo, ModeScriptSettings } from "@/types/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ModeScriptSettingsSchema } from "./game-schema";

export default function ModeScriptSettingsForm({
  modeScriptSettings,
  modeScriptInfo,
}: {
  modeScriptSettings: Record<string, unknown>;
  modeScriptInfo: ModeScriptInfo;
}) {
  const modeScriptSettingsForm = useForm<ModeScriptSettings>({
    resolver: zodResolver(ModeScriptSettingsSchema),
    defaultValues: modeScriptSettings as ModeScriptSettings,
  });

  async function onSubmitModeScriptSettings(values: ModeScriptSettings) {
    try {
      const parsedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => {
          if (value === true) return [key, true];
          if (value === false) return [key, false];
          if (!isNaN(Number(value)) && value !== "")
            return [key, Number(value)];
          return [key, value];
        }),
      );

      await setModeScriptSettings(parsedValues);
      toast.success("Mode Script Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update Mode Script Settings", {
        description: getErrorMessage(error),
      });
    }
  }

  function getDescription(key: string): string {
    const description = modeScriptInfo.ParamDescs.find(
      (desc) => desc.Name === key && desc.Desc != "<hidden>",
    )?.Desc;

    return description ? description : "";
  }

  function getElement(
    key: string,
    value: string | number | boolean,
  ): {
    label: string;
    description: string;
    type: string;
    className: string;
  } {
    switch (typeof value) {
      case "boolean":
        return {
          label: key
            .slice(2)
            .split(/(?=[A-Z])/)
            .join(" ")
            .replace(/^\w/, (c) => c.toUpperCase())
            .replace(/_/g, ""),
          description: getDescription(key),
          type: "checkbox",
          className: "",
        };
      case "number":
        return {
          label: key,
          description: getDescription(key),
          type: "number",
          className: "w-26",
        };
      case "string":
      default:
        return {
          label: key,
          description: getDescription(key),
          type: "text",
          className: "sm:w-2/3 xl:max-w-[calc(100%-192px)] min-w-48",
        };
    }
  }

  const formElements = Object.entries(modeScriptSettingsForm.getValues());
  const middleIndex = Math.ceil(formElements.length / 2);

  const leftElements = formElements.slice(0, middleIndex);
  const rightElements = formElements.slice(middleIndex);

  return (
    <Form {...modeScriptSettingsForm}>
      <form
        className="flex flex-col gap-4 max-sm:flex-col max-[768px]:flex-row min-[960px]:flex-row"
        onSubmit={modeScriptSettingsForm.handleSubmit(
          onSubmitModeScriptSettings,
        )}
      >
        <div className="flex flex-col gap-2 flex-1">
          {leftElements.map(([key, value]) => {
            const element = getElement(key, value);

            return (
              <FormElement
                key={key}
                control={modeScriptSettingsForm.control}
                name={key}
                label={element.label}
                description={element.description}
                placeholder="Enter value"
                error={modeScriptSettingsForm.formState.errors[key] as any}
                className={element.className}
                type={element.type}
              />
            );
          })}
          <Button
            className="w-20 hidden max-sm:hidden max-[768px]:block min-[960px]:block mt-4"
            type="submit"
            disabled={modeScriptSettingsForm.formState.isSubmitting}
          >
            Save
          </Button>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {rightElements.map(([key, value]) => {
            const element = getElement(key, value);

            return (
              <FormElement
                key={key}
                control={modeScriptSettingsForm.control}
                name={key}
                label={element.label}
                description={element.description}
                placeholder="Enter value"
                error={modeScriptSettingsForm.formState.errors[key] as any}
                className={element.className}
                type={element.type}
              />
            );
          })}
          <Button
            className="w-20 block max-sm:block max-[768px]:hidden min-[960px]:hidden mt-4"
            type="submit"
            disabled={modeScriptSettingsForm.formState.isSubmitting}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
