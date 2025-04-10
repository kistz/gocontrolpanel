"use client";

import { setModeScriptSettings } from "@/actions/gbx/game";
import FormElement from "@/components/form/form-element";
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
      await setModeScriptSettings(values);
      toast.success("Mode Script Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update Mode Script Settings", {
        description: getErrorMessage(error),
      });
    }
  }

  console.log(modeScriptInfo);

  function getDescription(key: string): string {
    const description = modeScriptInfo.ParamDescs.find(
      (desc) => desc.Name === key && desc.Desc != "<hidden>",
    )?.Desc;

    return description ? description : "No description available";
  }

  function getElement(
    key: string,
    value: string | number | boolean,
  ): {
    label: string;
    description: string;
    type: string;
  } {
    switch (typeof value) {
      case "boolean":
        return {
          label: key.slice(2).split(/(?=[A-Z])/).join(" "),
          description: getDescription(key),
          type: "checkbox",
        };
      case "number":
        return {
          label: key,
          description: getDescription(key),
          type: "number",
        };
      case "string":
        return {
          label: key,
          description: getDescription(key),
          type: "text",
        };
      default:
        return {
          label: key,
          description: getDescription(key),
          type: "text",
        };
    }
  }

  return (
    <Form {...modeScriptSettingsForm}>
      <form
        className="flex flex-col gap-4"
        onSubmit={modeScriptSettingsForm.handleSubmit(
          onSubmitModeScriptSettings,
        )}
      >
        {modeScriptSettingsForm.getValues() &&
          Object.entries(modeScriptSettingsForm.getValues()).map(
            ([key, value]) => {
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
                  className="w-1/2 xl:w-2/3 xl:max-w-[calc(100%-192px)] min-w-48"
                  type={element.type}
                />
              );
            },
          )}
      </form>
    </Form>
  );
}
