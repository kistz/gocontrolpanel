"use client";

import { setModeScriptSettings } from "@/actions/gbx/game";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { ModeScriptInfo, ModeScriptSettings } from "@/types/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ModeScriptSettingsSchema } from "./game-schema";

export default function ModeScriptSettingsForm({
  serverId,
  modeScriptSettings,
  modeScriptInfo,
}: {
  serverId: number;
  modeScriptSettings: Record<string, unknown>;
  modeScriptInfo: ModeScriptInfo;
}) {
  const modeScriptSettingsForm = useForm<ModeScriptSettings>({
    resolver: zodResolver(ModeScriptSettingsSchema),
    defaultValues: modeScriptSettings as ModeScriptSettings,
  });

  const onSubmitModeScriptSettings = useCallback(
    async (values: ModeScriptSettings) => {
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

        const { error } = await setModeScriptSettings(serverId, parsedValues);
        if (error) {
          throw new Error(error);
        }
        toast.success("Mode Script Settings updated successfully");
      } catch (error) {
        toast.error("Failed to update Mode Script Settings", {
          description: getErrorMessage(error),
        });
      }
    },
    [],
  );

  const descriptions = useMemo(() => {
    return modeScriptInfo.ParamDescs.reduce(
      (acc, desc) => {
        if (desc.Desc !== "<hidden>") acc[desc.Name] = desc.Desc;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [modeScriptInfo.ParamDescs]);

  const formElements = useMemo(() => {
    return Object.entries(modeScriptSettingsForm.getValues()).map(
      ([key, value]) => {
        return {
          key,
          value,
          label: key,
          description: descriptions[key] || "",
          placeholder: key
            .slice(2)
            .split(/(?=[A-Z])/)
            .join(" ")
            .replace(/^\w/, (c) => c.toUpperCase())
            .replace(/_/g, ""),
          type:
            typeof value === "boolean"
              ? "checkbox"
              : typeof value === "number"
                ? "number"
                : "text",
          className:
            typeof value === "number"
              ? "w-26"
              : "sm:w-2/3 xl:max-w-[calc(100%-192px)] min-w-48",
        };
      },
    );
  }, [modeScriptSettingsForm, descriptions]);

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
        <div className="flex flex-col gap-3 flex-1">
          {leftElements.map(({ key, ...element }) => (
            <FormElement
              key={key}
              control={modeScriptSettingsForm.control}
              name={key}
              label={element.label}
              description={element.description}
              placeholder={element.placeholder}
              error={modeScriptSettingsForm.formState.errors[key] as any}
              className={element.className}
              type={element.type}
            />
          ))}
          <Button
            className="w-20 hidden max-sm:hidden max-[768px]:block min-[960px]:block mt-4"
            type="submit"
            disabled={modeScriptSettingsForm.formState.isSubmitting}
          >
            Save
          </Button>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          {rightElements.map(({ key, ...element }) => (
            <FormElement
              key={key}
              control={modeScriptSettingsForm.control}
              name={key}
              label={element.label}
              description={element.description}
              placeholder={element.placeholder}
              error={modeScriptSettingsForm.formState.errors[key] as any}
              className={element.className}
              type={element.type}
            />
          ))}
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
